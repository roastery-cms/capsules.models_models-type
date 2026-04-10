import { barista } from "@roastery/barista";
import type { IControllersWithAuth } from "./types";
import { baristaAuth } from "@roastery-capsules/auth/plugins/guards";
import { ModelsType } from "@/domain";
import { EntitySource } from "@roastery/beans/entity/symbols";
import { ModelsTypeRepositoryPlugin } from "../plugins";
import { makeUpdateModelsTypeUseCase } from "@/infra/factories/application/use-cases";
import { IdOrSlugDTO } from "@roastery/seedbed/presentation/dtos";
import { UpdateModelsTypeQueryDTO } from "./dtos";
import { UpdateModelsTypeDTO } from "@/application/dtos";
import { UnpackedModelsTypeDTO } from "@/domain/dtos";

export function UpdateModelsTypeController({
    cacheProvider,
    jwtSecret,
    modelsTypeRepository,
    redisUrl,
}: IControllersWithAuth) {
    return barista().use(
        baristaAuth({
            layerName: ModelsType[EntitySource],
            jwtSecret,
            cacheProvider,
            redisUrl,
        })
            .use(ModelsTypeRepositoryPlugin(modelsTypeRepository))
            .derive({ as: "local" }, ({ modelsTypeRepository }) => ({
                updateModelsType:
                    makeUpdateModelsTypeUseCase(modelsTypeRepository),
            }))
            .patch(
                "/:id-or-slug",
                async ({
                    params: { "id-or-slug": idOrSlug },
                    body,
                    updateModelsType,
                    status,
                    query: { "update-slug": updateSlug },
                }) => {
                    const response = await updateModelsType.run(
                        idOrSlug,
                        body,
                        updateSlug,
                    );
                    return status(200, response as never);
                },
                {
                    params: IdOrSlugDTO,
                    query: UpdateModelsTypeQueryDTO,
                    body: UpdateModelsTypeDTO,
                    detail: {
                        summary: "Update a models type",
                        description: "Updates an existing models type by its ID or slug. Requires authentication.",
                    },
                    response: { 200: UnpackedModelsTypeDTO },
                },
            ),
    );
}
