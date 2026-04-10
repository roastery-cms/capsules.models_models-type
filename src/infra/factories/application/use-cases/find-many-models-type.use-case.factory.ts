import { FindManyModelsTypeUseCase } from "@/application/use-cases/find-many-models-type.use-case";
import { makeCountModelsTypeUseCase } from "./count-models-type.use-case.factory";
import type { IModelsTypeRepository } from "@/domain/types/repositories/models-type.repository.interface";

export function makeFindManyModelsTypeUseCase(
	repository: IModelsTypeRepository,
): FindManyModelsTypeUseCase {
	const countModelsType = makeCountModelsTypeUseCase(repository);
	return new FindManyModelsTypeUseCase(repository, countModelsType);
}
