import type { IRawEntity } from "@roastery/beans/entity/types";
import type { IConstructorModelsType } from "./constructor-models-type.interface";

export interface IUnpackedModelsType
	extends IConstructorModelsType,
		IRawEntity {}
