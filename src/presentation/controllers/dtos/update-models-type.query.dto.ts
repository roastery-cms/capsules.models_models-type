import { BooleanDTO } from "@roastery/beans/collections/dtos";
import { t } from "@roastery/terroir";

export const UpdateModelsTypeQueryDTO = t.Object({
    "update-slug": t.Optional(BooleanDTO),
});

export type UpdateModelsTypeQueryDTO = t.Static<
    typeof UpdateModelsTypeQueryDTO
>;
