import type { IEntity } from "@roastery/beans/entity/types";
import type { UnpackedModelsTypeSchema } from "../schemas";
import type { IRawModelsType } from "./raw-models-type.interface";

export interface IModelsType
	extends IEntity<UnpackedModelsTypeSchema>,
		IRawModelsType {
	rename(value: string): void;
	reslug(value: string): void;
	changeDescription(value: string): void;
}
