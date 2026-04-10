import { CountModelsTypeUseCase } from "@/application/use-cases/count-models-type.use-case";
import type { IModelsTypeRepository } from "@/domain/types/repositories/models-type.repository.interface";

export function makeCountModelsTypeUseCase(
	repository: IModelsTypeRepository,
): CountModelsTypeUseCase {
	return new CountModelsTypeUseCase(repository);
}
