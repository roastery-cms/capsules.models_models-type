import { barista } from "@roastery/barista";
import type { IControllersWithAuth } from "./types";
import { baristaAuth } from "@roastery-capsules/auth/plugins/guards";
import { ModelsType } from "@/domain";
import { EntitySource } from "@roastery/beans/entity/symbols";
import { ModelsTypeRepositoryPlugin } from "../plugins";
import { makeDeleteModelsTypeUseCase } from "@/infra/factories/application/use-cases";
import { IdOrSlugDTO } from "@roastery/seedbed/presentation/dtos";
import { t } from "@roastery/terroir";

export function DeleteModelsTypeController({
    cacheProvider,
    jwtSecret,
    modelsTypeRepository,
    redisUrl,
}: IControllersWithAuth) {
    return barista()
        .use(
            baristaAuth({
                layerName: ModelsType[EntitySource],
                jwtSecret,
                cacheProvider,
                redisUrl,
            }),
        )
        .use(ModelsTypeRepositoryPlugin(modelsTypeRepository))
        .derive({ as: "local" }, ({ modelsTypeRepository }) => ({
            deleteModelsType: makeDeleteModelsTypeUseCase(modelsTypeRepository),
        }))
        .delete(
            "/:id-or-slug",
            async ({
                params: { "id-or-slug": idOrSlug },
                deleteModelsType,
                set,
            }) => {
                await deleteModelsType.run(idOrSlug);
                set.status = 204;
                return;
            },
            {
                params: IdOrSlugDTO,
                detail: {
                    summary: "Delete a models type",
                    description: "Deletes a models type by its ID or slug. Requires authentication.",
                },
                response: { 204: t.Undefined() },
            },
        );
}
