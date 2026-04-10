import { beforeEach, describe, expect, it } from "bun:test";
import { ModelsTypeRepository } from "./models-type.repository";
import { ModelsType } from "@/domain/models-type";
import { Schema } from "@roastery/terroir/schema";
import { t } from "@roastery/terroir";
import {
	ConflictException,
	ResourceNotFoundException,
} from "@roastery/terroir/exceptions/infra";

const makeValidSchema = () =>
	Schema.make(t.Object({ content: t.String({ minLength: 1 }) })).toString();

const makeModelsType = (overrides?: { name?: string }) =>
	ModelsType.make({
		name: overrides?.name ?? "Review",
		description: "A review.",
		schema: makeValidSchema(),
	});

describe("ModelsTypeRepository", () => {
	let repository: ModelsTypeRepository;

	beforeEach(() => {
		repository = new ModelsTypeRepository();
	});

	describe("create", () => {
		it("should create a models type", async () => {
			const entity = makeModelsType();

			await repository.create(entity);

			expect(await repository.count()).toBe(1);
		});

		it("should throw ConflictException when id already exists", async () => {
			const entity = makeModelsType();
			await repository.create(entity);

			expect(repository.create(entity)).rejects.toBeInstanceOf(
				ConflictException,
			);
		});
	});

	describe("findById", () => {
		it("should return the entity when found", async () => {
			const entity = makeModelsType();
			await repository.create(entity);

			const found = await repository.findById(entity.id);

			expect(found).toBe(entity);
		});

		it("should return null when not found", async () => {
			const found = await repository.findById("nonexistent-id");

			expect(found).toBeNull();
		});
	});

	describe("findBySlug", () => {
		it("should return the entity when slug matches", async () => {
			const entity = makeModelsType({ name: "My Product" });
			await repository.create(entity);

			const found = await repository.findBySlug(entity.slug);

			expect(found).toBe(entity);
		});

		it("should return null when slug does not match", async () => {
			const found = await repository.findBySlug("nonexistent-slug");

			expect(found).toBeNull();
		});
	});

	describe("findMany", () => {
		it("should return entities for the given page", async () => {
			const entities = Array.from({ length: 3 }, (_, i) =>
				makeModelsType({ name: `Type ${i}` }),
			);
			repository.seed(entities);

			const result = await repository.findMany(0);

			expect(result).toHaveLength(3);
		});

		it("should paginate with page size of 10", async () => {
			const entities = Array.from({ length: 15 }, (_, i) =>
				makeModelsType({ name: `Type ${i}` }),
			);
			repository.seed(entities);

			const page0 = await repository.findMany(0);
			const page1 = await repository.findMany(1);

			expect(page0).toHaveLength(10);
			expect(page1).toHaveLength(5);
		});

		it("should return empty array for out-of-range page", async () => {
			const entity = makeModelsType();
			await repository.create(entity);

			const result = await repository.findMany(99);

			expect(result).toHaveLength(0);
		});
	});

	describe("count", () => {
		it("should return 0 when empty", async () => {
			expect(await repository.count()).toBe(0);
		});

		it("should return the number of stored entities", async () => {
			const entities = Array.from({ length: 5 }, (_, i) =>
				makeModelsType({ name: `Type ${i}` }),
			);
			repository.seed(entities);

			expect(await repository.count()).toBe(5);
		});
	});

	describe("update", () => {
		it("should update an existing entity", async () => {
			const entity = makeModelsType();
			await repository.create(entity);

			entity.rename("Updated Name");
			await repository.update(entity);

			const found = await repository.findById(entity.id);
			expect(found?.name).toBe("Updated Name");
		});

		it("should throw ResourceNotFoundException when entity does not exist", async () => {
			const entity = makeModelsType();

			expect(repository.update(entity)).rejects.toBeInstanceOf(
				ResourceNotFoundException,
			);
		});
	});

	describe("delete", () => {
		it("should remove the entity", async () => {
			const entity = makeModelsType();
			await repository.create(entity);

			await repository.delete(entity);

			expect(await repository.count()).toBe(0);
			expect(await repository.findById(entity.id)).toBeNull();
		});

		it("should throw ResourceNotFoundException when entity does not exist", async () => {
			const entity = makeModelsType();

			expect(repository.delete(entity)).rejects.toBeInstanceOf(
				ResourceNotFoundException,
			);
		});
	});

	describe("seed", () => {
		it("should bulk insert entities", () => {
			const entities = Array.from({ length: 3 }, (_, i) =>
				makeModelsType({ name: `Type ${i}` }),
			);

			repository.seed(entities);

			expect(repository.getAll()).toHaveLength(3);
		});
	});

	describe("clear", () => {
		it("should remove all entities", async () => {
			const entities = Array.from({ length: 3 }, (_, i) =>
				makeModelsType({ name: `Type ${i}` }),
			);
			repository.seed(entities);

			repository.clear();

			expect(await repository.count()).toBe(0);
		});
	});

	describe("getAll", () => {
		it("should return all stored entities", () => {
			const entities = Array.from({ length: 3 }, (_, i) =>
				makeModelsType({ name: `Type ${i}` }),
			);
			repository.seed(entities);

			const result = repository.getAll();

			expect(result).toHaveLength(3);
		});

		it("should return empty array when repository is empty", () => {
			expect(repository.getAll()).toHaveLength(0);
		});
	});
});
