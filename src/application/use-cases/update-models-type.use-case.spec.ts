import { beforeEach, describe, expect, it } from "bun:test";
import { UpdateModelsTypeUseCase } from "./update-models-type.use-case";
import { FindModelsTypeUseCase } from "./find-models-type.use-case";
import { ModelsTypeRepository } from "@/infra/repositories/test/models-type.repository";
import { SlugUniquenessCheckerService } from "@roastery/seedbed/domain/services";
import {
	InvalidOperationException,
	ResourceAlreadyExistsException,
	ResourceNotFoundException,
} from "@roastery/terroir/exceptions/application";
import { makeFindEntityByUseCase } from "@/infra/factories/application/use-cases/defaults";
import { makeModelsType } from "@/infra/factories/domain";

describe("UpdateModelsTypeUseCase", () => {
	let repository: ModelsTypeRepository;
	let useCase: UpdateModelsTypeUseCase;

	beforeEach(() => {
		repository = new ModelsTypeRepository();
		const findEntityByType = makeFindEntityByUseCase(repository);
		const findModelsType = new FindModelsTypeUseCase(findEntityByType);
		const uniquenessChecker = new SlugUniquenessCheckerService(repository);
		useCase = new UpdateModelsTypeUseCase(
			repository,
			findModelsType,
			uniquenessChecker,
		);
	});

	it("should update the name", async () => {
		const entity = makeModelsType();
		repository.seed([entity]);

		const updated = await useCase.run(entity.id, { name: "Updated Name" });

		expect(updated.name).toBe("Updated Name");
	});

	it("should update the description", async () => {
		const entity = makeModelsType();
		repository.seed([entity]);

		const updated = await useCase.run(entity.id, {
			description: "Updated description.",
		});

		expect(updated.description).toBe("Updated description.");
	});

	it("should update the slug directly", async () => {
		const entity = makeModelsType();
		repository.seed([entity]);

		const updated = await useCase.run(entity.id, { slug: "new-slug" });

		expect(updated.slug).toBe("new-slug");
	});

	it("should update slug from name when updateSlug is true", async () => {
		const entity = makeModelsType();
		repository.seed([entity]);

		const updated = await useCase.run(entity.id, { name: "New Name" }, true);

		expect(updated.name).toBe("New Name");
		expect(updated.slug).toBe("new-name");
	});

	it("should find entity by slug and update", async () => {
		const entity = makeModelsType("My Product");
		repository.seed([entity]);

		const updated = await useCase.run(entity.slug, {
			name: "Updated Product",
		});

		expect(updated.name).toBe("Updated Product");
	});

	it("should set updatedAt after update", async () => {
		const entity = makeModelsType();
		repository.seed([entity]);

		const updated = await useCase.run(entity.id, { name: "Updated" });

		expect(updated.updatedAt).toBeString();
	});

	it("should throw InvalidOperationException when data does not match schema", async () => {
		const entity = makeModelsType();
		repository.seed([entity]);

		expect(useCase.run(entity.id, { name: "" })).rejects.toBeInstanceOf(
			InvalidOperationException,
		);
	});

	it("should throw InvalidOperationException when updateSlug is true and slug is also provided", async () => {
		const entity = makeModelsType();
		repository.seed([entity]);

		expect(
			useCase.run(entity.id, { name: "New", slug: "custom-slug" }, true),
		).rejects.toBeInstanceOf(InvalidOperationException);
	});

	it("should throw ResourceNotFoundException when entity does not exist", async () => {
		expect(
			useCase.run("nonexistent-slug", { name: "Updated" }),
		).rejects.toBeInstanceOf(ResourceNotFoundException);
	});

	it("should throw ResourceAlreadyExistsException when new slug already exists", async () => {
		const entity1 = makeModelsType("First");
		const entity2 = makeModelsType("Second");
		repository.seed([entity1, entity2]);

		expect(
			useCase.run(entity2.id, { slug: entity1.slug }),
		).rejects.toBeInstanceOf(ResourceAlreadyExistsException);
	});

	it("should not throw when reslugging to the same slug", async () => {
		const entity = makeModelsType("Review");
		repository.seed([entity]);

		const updated = await useCase.run(entity.id, { slug: entity.slug });

		expect(updated.slug).toBe(entity.slug);
	});
});
