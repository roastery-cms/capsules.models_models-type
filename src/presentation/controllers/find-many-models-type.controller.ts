import { barista } from "@roastery/barista";
import type { IControllersWithoutAuth } from "./types";
import { ModelsTypeRepositoryPlugin } from "../plugins";
import { makeFindManyModelsTypeUseCase } from "@/infra/factories/application/use-cases";
import { PaginationDTO } from "@roastery/seedbed/presentation/dtos";
import { FindManyModelsTypeResponseDTO } from "./dtos";

export function FindManyModelsTypeController({
	modelsTypeRepository,
}: IControllersWithoutAuth) {
	return barista()
		.use(ModelsTypeRepositoryPlugin(modelsTypeRepository))
		.derive({ as: "local" }, ({ modelsTypeRepository }) => ({
			findManyModelsType: makeFindManyModelsTypeUseCase(modelsTypeRepository),
		}))
		.get(
			"/",
			async ({ query: { page }, findManyModelsType, status, set }) => {
				const { count, totalPages, value } = await findManyModelsType.run(page);

				set.headers["X-Total-Count"] = String(count);
				set.headers["X-Total-Pages"] = String(totalPages);

				return status(200, value as never);
			},
			{
				query: PaginationDTO,
				detail: {
					summary: "Find many models types",
					description: "Retrieves a paginated list of models types.",
				},
				response: { 200: FindManyModelsTypeResponseDTO },
			},
		);
}
