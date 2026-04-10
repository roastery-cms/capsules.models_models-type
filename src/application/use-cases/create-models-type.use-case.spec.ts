import { beforeEach, describe, expect, it } from "bun:test";
import { CreateModelsTypeUseCase } from "./create-models-type.use-case";
import { ModelsTypeRepository } from "@/infra/repositories/test/models-type.repository";
import { SlugUniquenessCheckerService } from "@roastery/seedbed/domain/services";
import { ResourceAlreadyExistsException } from "@roastery/terroir/exceptions/application";
import { UuidSchema } from "@roastery/beans/collections/schemas";
import { makeModelsType } from "@/infra/factories/domain";

describe("CreateModelsTypeUseCase", () => {
    let repository: ModelsTypeRepository;
    let useCase: CreateModelsTypeUseCase;

    beforeEach(() => {
        repository = new ModelsTypeRepository();
        const uniquenessChecker = new SlugUniquenessCheckerService(repository);
        useCase = new CreateModelsTypeUseCase(repository, uniquenessChecker);
    });

    it("should create a models type and persist it", async () => {
        const result = await useCase.run({
            name: "Review",
            description: "A review.",
            schema: UuidSchema.toString(),
        });

        expect(result.name).toBe("Review");
        expect(result.description).toBe("A review.");
        expect(await repository.count()).toBe(1);
    });

    it("should generate an id for the created entity", async () => {
        const result = await useCase.run({
            name: "Review",
            description: "A review.",
            schema: UuidSchema.toString(),
        });

        expect(result.id).toBeString();
    });

    it("should throw ResourceAlreadyExistsException when slug already exists", async () => {
        const existing = makeModelsType("Review");
        repository.seed([existing]);

        expect(
            useCase.run({
                name: "Review",
                description: "Another review.",
                schema: UuidSchema.toString(),
            }),
        ).rejects.toBeInstanceOf(ResourceAlreadyExistsException);
    });
});
