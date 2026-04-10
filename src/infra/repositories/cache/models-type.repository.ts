import type { IModelsType } from "@/domain/types";
import type { IModelsTypeRepository } from "@/domain/types/repositories";
import { ModelsTypeMapper } from "./models-type.mapper";
import { ModelsType } from "@/domain";
import { CACHE_EXPIRATION_TIME } from "@roastery/seedbed/constants";
import type { BaristaCacheInstance } from "@roastery-adapters/cache";
import { SafeCache } from "@roastery-adapters/cache/decorators";
import { EntitySource } from "@roastery/beans/entity/symbols";
import { Mapper } from "@roastery/beans";

export class ModelsTypeRepository implements IModelsTypeRepository {
	private readonly cacheExpirationTime: number = CACHE_EXPIRATION_TIME.SAFE;

	constructor(
		private readonly repository: IModelsTypeRepository,
		private readonly cache: BaristaCacheInstance,
	) {}

	async create(modelsType: IModelsType): Promise<void> {
		await this.repository.create(modelsType);
		await Promise.all([
			this.cacheModelsType(modelsType),
			this.invalidateListCache(),
		]);
	}

	@SafeCache(ModelsType[EntitySource])
	async delete(modelsType: IModelsType): Promise<void> {
		await this.repository.delete(modelsType);

		await Promise.all([
			this.cache.del(`${ModelsType[EntitySource]}::$${modelsType.id}`),
			this.cache.del(`${ModelsType[EntitySource]}::${modelsType.slug}`),
			this.invalidateListCache(),
		]);
	}

	@SafeCache(ModelsType[EntitySource])
	async findById(id: string): Promise<IModelsType | null> {
		const storedModelsType = await this.cache.get(
			`${ModelsType[EntitySource]}::$${id}`,
		);

		if (storedModelsType)
			return ModelsTypeMapper.run(
				`${ModelsType[EntitySource]}::$${id}`,
				storedModelsType,
			);

		const targetModelsType = await this.repository.findById(id);

		if (!targetModelsType) return null;

		await this.cacheModelsType(targetModelsType);

		return targetModelsType;
	}

	@SafeCache(ModelsType[EntitySource])
	async findBySlug(slug: string): Promise<IModelsType | null> {
		const storedId = await this.cache.get(
			`${ModelsType[EntitySource]}::${slug}`,
		);

		if (storedId) {
			const modelsType = await this.findById(storedId);

			if (modelsType && modelsType.slug === slug) return modelsType;

			await this.cache.del(`${ModelsType[EntitySource]}::${slug}`);
		}

		const targetModelsType = await this.repository.findBySlug(slug);

		if (!targetModelsType) return null;

		await this.cacheModelsType(targetModelsType);

		return targetModelsType;
	}

	@SafeCache(ModelsType[EntitySource])
	async findMany(page: number): Promise<IModelsType[]> {
		const key = `${ModelsType[EntitySource]}:page::${page}`;
		const storedIds = await this.cache.get(key);

		if (storedIds) {
			try {
				const ids: string[] = JSON.parse(storedIds);
				return await this.findManyByIds(ids);
			} catch {
				await this.cache.del(key);
			}
		}

		const targetModelsTypes = await this.repository.findMany(page);

		await Promise.all([
			...targetModelsTypes.map((modelsType) =>
				this.cacheModelsType(modelsType),
			),
			this.cache.set(
				key,
				JSON.stringify(targetModelsTypes.map((modelsType) => modelsType.id)),
				"EX",
				this.cacheExpirationTime,
			),
		]);

		return targetModelsTypes;
	}

	@SafeCache(ModelsType[EntitySource])
	private async findManyByIds(ids: string[]): Promise<IModelsType[]> {
		if (ids.length === 0) return [];

		const keys = ids.map((id) => `${ModelsType[EntitySource]}::$${id}`);
		const cachedValues = await this.cache.mget(...keys);

		const modelsTypesMap = new Map<string, IModelsType>();
		const missedIds: string[] = [];

		for (let i = 0; i < ids.length; i++) {
			const id = ids[i];
			if (!id) continue;

			const cached = cachedValues[i];

			if (cached) {
				try {
					const modelsType = ModelsTypeMapper.run(
						`${ModelsType[EntitySource]}::$${id}`,
						cached,
					);
					modelsTypesMap.set(id, modelsType);
				} catch {
					missedIds.push(id);
				}
			} else {
				missedIds.push(id);
			}
		}

		if (missedIds.length > 0) {
			const fetchedModelsTypes = await this.repository.findMany(0);

			const filteredModelsTypes = fetchedModelsTypes.filter((mt) =>
				missedIds.includes(mt.id),
			);

			await Promise.all(
				filteredModelsTypes.map(async (mt) => {
					await this.cacheModelsType(mt);
					modelsTypesMap.set(mt.id, mt);
				}),
			);
		}

		return ids
			.map((id) => modelsTypesMap.get(id))
			.filter(
				(modelsType): modelsType is IModelsType => modelsType !== undefined,
			);
	}

	@SafeCache(ModelsType[EntitySource])
	async update(modelsType: IModelsType): Promise<void> {
		const _cachedModelsType = await this.cache.get(
			`${ModelsType[EntitySource]}::$${modelsType.id}`,
		);

		if (_cachedModelsType) {
			const cachedModelsType: IModelsType = ModelsTypeMapper.run(
				`${ModelsType[EntitySource]}::$${modelsType.id}`,
				_cachedModelsType,
			);

			await Promise.all([
				this.cache.del(`${ModelsType[EntitySource]}::$${cachedModelsType.id}`),
				this.cache.del(`${ModelsType[EntitySource]}::${cachedModelsType.slug}`),
			]);
		}

		await this.repository.update(modelsType);

		await Promise.all([
			this.cacheModelsType(modelsType),
			this.invalidateListCache(),
		]);
	}

	count(): Promise<number> {
		return this.repository.count();
	}

	@SafeCache(ModelsType[EntitySource])
	private async cacheModelsType(modelsType: IModelsType): Promise<void> {
		const unpacked = Mapper.toDTO(modelsType);

		await Promise.all([
			this.cache.set(
				`${ModelsType[EntitySource]}::$${modelsType.id}`,
				JSON.stringify(unpacked),
				"EX",
				this.cacheExpirationTime,
			),
			this.cache.set(
				`${ModelsType[EntitySource]}::${modelsType.slug}`,
				modelsType.id,
				"EX",
				this.cacheExpirationTime,
			),
		]);
	}

	@SafeCache(ModelsType[EntitySource])
	private async invalidateListCache(): Promise<void> {
		const patterns = [`${ModelsType[EntitySource]}:page:*`];

		for (const pattern of patterns) {
			let cursor = "0";
			do {
				const [newCursor, keys] = await this.cache.scan(
					cursor,
					"MATCH",
					pattern,
					"COUNT",
					100,
				);

				cursor = newCursor;

				if (keys.length > 0) {
					await this.cache.del(...keys);
				}
			} while (cursor !== "0");
		}
	}
}
