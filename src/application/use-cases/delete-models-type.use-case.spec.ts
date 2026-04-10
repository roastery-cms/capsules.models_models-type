import { beforeEach, describe, expect, it } from "bun:test";
import { DeleteModelsTypeUseCase } from "./delete-models-type.use-case";
import { FindModelsTypeUseCase } from "./find-models-type.use-case";
import { ModelsTypeRepository } from "@/infra/repositories/test/models-type.repository";
import { FindEntityByTypeUseCase } from "@roastery/seedbed/application/use-cases";
import { ResourceNotFoundException } from "@roastery/terroir/exceptions/application";
import { makeModelsType } from "@/infra/factories/domain/make-models-type.factory";

describe("DeleteModelsTypeUseCase", () => {
    let repository: ModelsTypeRepository;
    let useCase: DeleteModelsTypeUseCase;

    beforeEach(() => {
        repository = new ModelsTypeRepository();
        const findEntityByType = new FindEntityByTypeUseCase(repository);
        const findModelsType = new FindModelsTypeUseCase(
            findEntityByType as unknown as never,
        );
        useCase = new DeleteModelsTypeUseCase(repository, findModelsType);
    });

    it("should delete a models type by id", async () => {
        const entity = makeModelsType();
        repository.seed([entity]);

        const deleted = await useCase.run(entity.id);

        expect(deleted).toBe(entity);
        expect(await repository.count()).toBe(0);
    });

    it("should delete a models type by slug", async () => {
        const entity = makeModelsType();
        repository.seed([entity]);

        const deleted = await useCase.run(entity.slug);

        expect(deleted).toBe(entity);
        expect(await repository.count()).toBe(0);
    });

    it("should throw ResourceNotFoundException when entity does not exist", async () => {
        expect(useCase.run("nonexistent-slug")).rejects.toBeInstanceOf(
            ResourceNotFoundException,
        );
    });
});
