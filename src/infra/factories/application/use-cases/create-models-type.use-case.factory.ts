import { CreateModelsTypeUseCase } from "@/application/use-cases/create-models-type.use-case";
import { makeSlugUniquenessCheckerService } from "@/infra/factories/domain/services/slug-uniqueness-checker.service.factory";
import type { IModelsTypeRepository } from "@/domain/types/repositories/models-type.repository.interface";

export function makeCreateModelsTypeUseCase(
    repository: IModelsTypeRepository,
): CreateModelsTypeUseCase {
    const uniquenessChecker = makeSlugUniquenessCheckerService(repository);
    return new CreateModelsTypeUseCase(repository, uniquenessChecker);
}
