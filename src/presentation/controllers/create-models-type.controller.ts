import { barista } from "@roastery/barista";
import type { IControllersWithAuth } from "./types";
import { baristaAuth } from "@roastery-capsules/auth/plugins/guards";
import { ModelsType } from "@/domain";
import { EntitySource } from "@roastery/beans/entity/symbols";
import { ModelsTypeRepositoryPlugin } from "../plugins";
import { makeCreateModelsTypeUseCase } from "@/infra/factories/application/use-cases";
import { CreateModelsTypeDTO } from "@/application/dtos";
import { UnpackedModelsTypeDTO } from "@/domain/dtos";

export function CreateModelsTypeController({
    cacheProvider,
    jwtSecret,
    modelsTypeRepository,
    redisUrl,
}: IControllersWithAuth) {
    return barista()
        .use(
            baristaAuth({
                cacheProvider,
                jwtSecret,
                layerName: ModelsType[EntitySource],
                redisUrl,
            }),
        )
        .use(ModelsTypeRepositoryPlugin(modelsTypeRepository))
        .derive({ as: "local" }, ({ modelsTypeRepository }) => ({
            createModelsType: makeCreateModelsTypeUseCase(modelsTypeRepository),
        }))
        .post(
            "/",
            async ({ body, createModelsType, status }) => {
                const response = await createModelsType.run(body);
                return status(201, response as never);
            },
            {
                body: CreateModelsTypeDTO,
                detail: {
                    summary: "Create a models type",
                    description: "Creates a new models type with the provided data. Requires authentication.",
                },
                response: { 201: UnpackedModelsTypeDTO },
            },
        );
}
