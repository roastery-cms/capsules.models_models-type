import { FindModelsTypeUseCase } from "@/application/use-cases/find-models-type.use-case";
import type { IModelsTypeRepository } from "@/domain/types/repositories/models-type.repository.interface";
import { makeFindEntityByUseCase } from "./defaults";

export function makeFindModelsTypeUseCase(
	repository: IModelsTypeRepository,
): FindModelsTypeUseCase {
	const findEntityByType = makeFindEntityByUseCase(repository);
	return new FindModelsTypeUseCase(findEntityByType);
}
