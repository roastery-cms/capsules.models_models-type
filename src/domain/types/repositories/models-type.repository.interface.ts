import type { IModelsTypeReader } from "./models-type-reader.interface";
import type { IModelsTypeWriter } from "./models-type-writer.interface";

export interface IModelsTypeRepository
	extends IModelsTypeWriter,
		IModelsTypeReader {}
