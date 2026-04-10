import { DeleteModelsTypeUseCase } from "@/application/use-cases/delete-models-type.use-case";
import { makeFindModelsTypeUseCase } from "./find-models-type.use-case.factory";
import type { IModelsTypeRepository } from "@/domain/types/repositories/models-type.repository.interface";

export function makeDeleteModelsTypeUseCase(
	repository: IModelsTypeRepository,
): DeleteModelsTypeUseCase {
	const findModelsType = makeFindModelsTypeUseCase(repository);
	return new DeleteModelsTypeUseCase(repository, findModelsType);
}
