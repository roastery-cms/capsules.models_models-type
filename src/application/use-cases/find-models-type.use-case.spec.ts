import { beforeEach, describe, expect, it } from "bun:test";
import { FindModelsTypeUseCase } from "./find-models-type.use-case";
import { ModelsTypeRepository } from "@/infra/repositories/test/models-type.repository";
import { ResourceNotFoundException } from "@roastery/terroir/exceptions/application";
import { makeFindEntityByUseCase } from "@/infra/factories/application/use-cases/defaults";
import { makeModelsType } from "@/infra/factories/domain";

describe("FindModelsTypeUseCase", () => {
    let repository: ModelsTypeRepository;
    let useCase: FindModelsTypeUseCase;

    beforeEach(() => {
        repository = new ModelsTypeRepository();
        const findEntityByType = makeFindEntityByUseCase(repository);
        useCase = new FindModelsTypeUseCase(findEntityByType);
    });

    it("should find a models type by id", async () => {
        const entity = makeModelsType();
        repository.seed([entity]);

        const found = await useCase.run(entity.id);

        expect(found).toBe(entity);
    });

    it("should find a models type by slug", async () => {
        const entity = makeModelsType("My Product");
        repository.seed([entity]);

        const found = await useCase.run(entity.slug);

        expect(found).toBe(entity);
    });

    it("should throw ResourceNotFoundException when not found by id", async () => {
        expect(
            useCase.run("019d0000-0000-7000-0000-000000000000"),
        ).rejects.toBeInstanceOf(ResourceNotFoundException);
    });

    it("should throw ResourceNotFoundException when not found by slug", async () => {
        expect(useCase.run("nonexistent-slug")).rejects.toBeInstanceOf(
            ResourceNotFoundException,
        );
    });
});
