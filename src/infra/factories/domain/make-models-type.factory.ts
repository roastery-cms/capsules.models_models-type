import { ModelsType } from "@/domain/models-type";
import type { IModelsType } from "@/domain/types";
import { UuidSchema } from "@roastery/beans/collections/schemas";

export function makeModelsType(
    name = "Review",
    description = "A review written by a user about a product.",
    schema = UuidSchema.toString(),
): IModelsType {
    return ModelsType.make({ name, description, schema });
}
