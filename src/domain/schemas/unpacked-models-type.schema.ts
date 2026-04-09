import { Schema } from "@roastery/terroir/schema";
import { UnpackedModelsTypeDTO } from "../dtos";

export const UnpackedModelsTypeSchema: Schema<typeof UnpackedModelsTypeDTO> =
    Schema.make<typeof UnpackedModelsTypeDTO>(UnpackedModelsTypeDTO);

export type UnpackedModelsTypeSchema = typeof UnpackedModelsTypeDTO;
