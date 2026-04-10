import { Schema } from "@roastery/terroir/schema";
import { CreateModelsTypeDTO } from "../dtos";

export const CreateModelsTypeSchema: Schema<typeof CreateModelsTypeDTO> =
	Schema.make<typeof CreateModelsTypeDTO>(CreateModelsTypeDTO);

export type CreateModelsTypeSchema = typeof CreateModelsTypeDTO;
