import { beforeEach, describe, expect, it } from "bun:test";
import { CountModelsTypeUseCase } from "./count-models-type.use-case";
import { ModelsTypeRepository } from "@/infra/repositories/test/models-type.repository";
import { makeModelsType } from "@/infra/factories/domain";

describe("CountModelsTypeUseCase", () => {
    let repository: ModelsTypeRepository;
    let useCase: CountModelsTypeUseCase;

    beforeEach(() => {
        repository = new ModelsTypeRepository();
        useCase = new CountModelsTypeUseCase(repository);
    });

    it("should return count and totalPages", async () => {
        const entities = Array.from({ length: 15 }, (_, i) =>
            makeModelsType(`Type ${i}`),
        );
        repository.seed(entities);

        const result = await useCase.run();

        expect(result.count).toBe(15);
        expect(result.totalPages).toBe(2);
    });

    it("should return 0 count and 0 totalPages when empty", async () => {
        const result = await useCase.run();

        expect(result.count).toBe(0);
        expect(result.totalPages).toBe(0);
    });
});
