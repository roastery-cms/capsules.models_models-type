import type { IModelsType } from "@/domain/types";

export interface IFindManyModelsTypeUseCaseOutput {
	value: IModelsType[];
	count: number;
	totalPages: number;
}
