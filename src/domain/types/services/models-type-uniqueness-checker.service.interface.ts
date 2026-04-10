import type { UnpackedModelsTypeSchema } from "@/domain/schemas";
import type { IModelsType } from "@/domain/types";
import type { SlugUniquenessCheckerService } from "@roastery/seedbed/domain/services";

export type IModelsTypeUniquenessCheckerService = SlugUniquenessCheckerService<
	UnpackedModelsTypeSchema,
	IModelsType
>;
