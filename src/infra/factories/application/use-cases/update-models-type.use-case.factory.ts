import { UpdateModelsTypeUseCase } from "@/application/use-cases/update-models-type.use-case";
import { makeFindModelsTypeUseCase } from "./find-models-type.use-case.factory";
import { makeSlugUniquenessCheckerService } from "@/infra/factories/domain/services/slug-uniqueness-checker.service.factory";
import type { IModelsTypeRepository } from "@/domain/types/repositories/models-type.repository.interface";

export function makeUpdateModelsTypeUseCase(
    repository: IModelsTypeRepository,
): UpdateModelsTypeUseCase {
    const findModelsType = makeFindModelsTypeUseCase(repository);
    const uniquenessChecker = makeSlugUniquenessCheckerService(repository);
    return new UpdateModelsTypeUseCase(
        repository,
        findModelsType,
        uniquenessChecker,
    );
}
