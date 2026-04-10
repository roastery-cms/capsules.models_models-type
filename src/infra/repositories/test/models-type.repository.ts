import { EntitySource } from "@roastery/beans/entity/symbols";
import {
	ConflictException,
	ResourceNotFoundException,
} from "@roastery/terroir/exceptions/infra";
import { ModelsType } from "@/domain/models-type";
import type { IModelsType } from "@/domain/types";
import type { IModelsTypeRepository } from "@/domain/types/repositories/models-type.repository.interface";

export class ModelsTypeRepository implements IModelsTypeRepository {
	private modelsTypes: Map<string, IModelsType>;

	constructor() {
		this.modelsTypes = new Map();
	}

	async create(data: IModelsType): Promise<void> {
		if (this.modelsTypes.has(data.id)) {
			throw new ConflictException(ModelsType[EntitySource]);
		}

		this.modelsTypes.set(data.id, data);
	}

	async findById(id: string): Promise<IModelsType | null> {
		return this.modelsTypes.get(id) ?? null;
	}

	async findBySlug(slug: string): Promise<IModelsType | null> {
		for (const modelsType of this.modelsTypes.values()) {
			if (modelsType.slug === slug) {
				return modelsType;
			}
		}
		return null;
	}

	async findMany(page: number): Promise<IModelsType[]> {
		const pageSize = 10;
		const start = page * pageSize;

		return Array.from(this.modelsTypes.values()).slice(start, start + pageSize);
	}

	async count(): Promise<number> {
		return this.modelsTypes.size;
	}

	async update(data: IModelsType): Promise<void> {
		if (!this.modelsTypes.has(data.id)) {
			throw new ResourceNotFoundException(ModelsType[EntitySource]);
		}

		this.modelsTypes.set(data.id, data);
	}

	async delete(data: IModelsType): Promise<void> {
		if (!this.modelsTypes.has(data.id)) {
			throw new ResourceNotFoundException(ModelsType[EntitySource]);
		}

		this.modelsTypes.delete(data.id);
	}

	seed(modelsTypes: IModelsType[]): void {
		for (const modelsType of modelsTypes) {
			this.modelsTypes.set(modelsType.id, modelsType);
		}
	}

	clear(): void {
		this.modelsTypes.clear();
	}

	getAll(): IModelsType[] {
		return Array.from(this.modelsTypes.values());
	}
}
