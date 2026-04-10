import type { IModelsType } from "@/domain/types";

export interface IModelsTypeWriter {
	create(data: IModelsType): Promise<void>;
	update(data: IModelsType): Promise<void>;
	delete(data: IModelsType): Promise<void>;
}
