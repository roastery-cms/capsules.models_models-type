import { UnpackedModelsTypeDTO } from "@/domain/dtos";
import { t } from "@roastery/terroir";

export const FindManyModelsTypeResponseDTO = t.Array(UnpackedModelsTypeDTO, {
    description: "A paginated list of models types.",
});

export type FindManyModelsTypeResponseDTO = t.Static<
    typeof FindManyModelsTypeResponseDTO
>;
