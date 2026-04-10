import { Schema } from "@roastery/terroir/schema";
import { UpdateModelsTypeDTO } from "../dtos";

export const UpdateModelsTypeSchema: Schema<typeof UpdateModelsTypeDTO> =
	Schema.make<typeof UpdateModelsTypeDTO>(UpdateModelsTypeDTO);

export type UpdateModelsTypeSchema = typeof UpdateModelsTypeDTO;
