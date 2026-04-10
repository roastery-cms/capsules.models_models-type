import { ModelsType } from "@/domain";
import type { IModelsTypeRepository } from "@/domain/types/repositories";
import { barista } from "@roastery/barista";
import { EntitySource } from "@roastery/beans/entity/symbols";

export function ModelsTypeRepositoryPlugin(
	modelsTypeRepository: IModelsTypeRepository,
) {
	return barista({ name: ModelsType[EntitySource] }).decorate(
		"modelsTypeRepository",
		modelsTypeRepository,
	);
}
