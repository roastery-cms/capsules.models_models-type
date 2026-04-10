import { t } from "@roastery/terroir";
import { RepositoryProviderDTO } from "@/infra/factories/repositories/dtos";

export const ModelsTypeDependenciesDTO = t.Object({
    DATABASE_URL: t.Optional(t.String()),
    DATABASE_PROVIDER: t.Optional(RepositoryProviderDTO),
});

export type ModelsTypeDependenciesDTO = t.Static<
    typeof ModelsTypeDependenciesDTO
>;
