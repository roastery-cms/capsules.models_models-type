import type { Schema } from "@roastery/terroir/schema";
import type { SchemaDTO } from "../dtos";

export interface IRawModelsType {
	readonly name: string;
	readonly slug: string;
	readonly description: string;
	readonly schema: Schema<typeof SchemaDTO>;
}
