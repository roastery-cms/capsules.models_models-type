import { beforeEach, describe, expect, it } from "bun:test";
import { FindManyModelsTypeUseCase } from "./find-many-models-type.use-case";
import { CountModelsTypeUseCase } from "./count-models-type.use-case";
import { ModelsTypeRepository } from "@/infra/repositories/test/models-type.repository";
import { makeModelsType } from "@/infra/factories/domain";

describe("FindManyModelsTypeUseCase", () => {
	let repository: ModelsTypeRepository;
	let useCase: FindManyModelsTypeUseCase;

	beforeEach(() => {
		repository = new ModelsTypeRepository();
		const countUseCase = new CountModelsTypeUseCase(repository);
		useCase = new FindManyModelsTypeUseCase(repository, countUseCase);
	});

	it("should return entities with count and totalPages", async () => {
		const entities = Array.from({ length: 3 }, (_, i) =>
			makeModelsType(`Type ${i}`),
		);
		repository.seed(entities);

		const result = await useCase.run(0);

		expect(result.value).toHaveLength(3);
		expect(result.count).toBe(3);
		expect(result.totalPages).toBe(1);
	});

	it("should paginate results", async () => {
		const entities = Array.from({ length: 15 }, (_, i) =>
			makeModelsType(`Type ${i}`),
		);
		repository.seed(entities);

		const page0 = await useCase.run(0);
		const page1 = await useCase.run(1);

		expect(page0.value).toHaveLength(10);
		expect(page1.value).toHaveLength(5);
		expect(page0.totalPages).toBe(2);
	});

	it("should return empty result when no entities exist", async () => {
		const result = await useCase.run(0);

		expect(result.value).toHaveLength(0);
		expect(result.count).toBe(0);
		expect(result.totalPages).toBe(0);
	});
});
