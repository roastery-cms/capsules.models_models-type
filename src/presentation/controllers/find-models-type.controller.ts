import { barista } from "@roastery/barista";
import type { IControllersWithoutAuth } from "./types";
import { ModelsTypeRepositoryPlugin } from "../plugins";
import { makeFindModelsTypeUseCase } from "@/infra/factories/application/use-cases";
import { IdOrSlugDTO } from "@roastery/seedbed/presentation/dtos";
import { UnpackedModelsTypeDTO } from "@/domain/dtos";

export function FindModelsTypeController({
    modelsTypeRepository,
}: IControllersWithoutAuth) {
    return barista()
        .use(ModelsTypeRepositoryPlugin(modelsTypeRepository))
        .derive({ as: "local" }, ({ modelsTypeRepository }) => ({
            findModelsType: makeFindModelsTypeUseCase(modelsTypeRepository),
        }))
        .get(
            "/:id-or-slug",
            async ({
                params: { "id-or-slug": idOrSlug },
                findModelsType,
                status,
            }) => {
                const response = await findModelsType.run(idOrSlug);
                return status(200, response as never);
            },
            {
                params: IdOrSlugDTO,
                detail: {
                    summary: "Find a models type",
                    description: "Retrieves a single models type by its ID or slug.",
                },
                response: { 200: UnpackedModelsTypeDTO },
            },
        );
}
