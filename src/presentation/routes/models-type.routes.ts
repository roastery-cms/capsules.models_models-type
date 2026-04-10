import { barista } from "@roastery/barista";
import type { IControllersWithoutAuth } from "../controllers/types";
import type { IModelsTypeRoutesArgs } from "./types";
import { ModelsTypeTags } from "../tags";
import { ModelsType } from "@/domain";
import { EntitySource } from "@roastery/beans/entity/symbols";
import {
	CreateModelsTypeController,
	DeleteModelsTypeController,
	FindModelsTypeController,
	UpdateModelsTypeController,
	FindManyModelsTypeController,
} from "../controllers";

export function ModelsTypeRoutes(data: IModelsTypeRoutesArgs) {
	const { modelsTypeRepository } = data;
	const controllersWithAuth = data;
	const controllersWithoutAuth: IControllersWithoutAuth = {
		modelsTypeRepository,
	};

	return barista({
		prefix: "/models-types",
		detail: {
			summary: ModelsTypeTags.name,
			tags: [ModelsTypeTags.name],
			description: ModelsTypeTags.description,
		},
		name: ModelsType[EntitySource],
	})
		.use(CreateModelsTypeController(controllersWithAuth))
		.use(UpdateModelsTypeController(controllersWithAuth))
		.use(DeleteModelsTypeController(controllersWithAuth))
		.use(FindModelsTypeController(controllersWithoutAuth))
		.use(FindManyModelsTypeController(controllersWithoutAuth));
}
