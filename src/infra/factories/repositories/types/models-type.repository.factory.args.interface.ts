import type { BaristaCacheInstance } from "@roastery-adapters/cache";
import type { PrismaClient } from "@roastery-adapters/models";
import type { RepositoryProviderDTO } from "../dtos";

export interface IMakeModelsTypeRepositoryArgs {
    target?: RepositoryProviderDTO;
    cache: BaristaCacheInstance;
    prismaClient?: PrismaClient;
}
