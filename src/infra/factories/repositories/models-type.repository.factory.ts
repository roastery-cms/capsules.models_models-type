import type { IModelsTypeRepository } from "@/domain/types/repositories";
import type { IMakeModelsTypeRepositoryArgs } from "./types";
import { ResourceNotFoundException } from "@roastery/terroir/exceptions/infra";
import { ModelsType } from "@/domain";
import { EntitySource } from "@roastery/beans/entity/symbols";
import {
    CachedModelsTypeRepository,
    PrismaModelsTypeRepository,
    TestModelsTypeRepository,
} from "@/infra/repositories";

export function makeModelsTypeRepository({
    cache,
    prismaClient,
    target,
}: IMakeModelsTypeRepositoryArgs): IModelsTypeRepository {
    if (target === "PRISMA" && !prismaClient)
        throw new ResourceNotFoundException(ModelsType[EntitySource]);

    const repository =
        target === "PRISMA" && prismaClient
            ? new PrismaModelsTypeRepository(prismaClient)
            : new TestModelsTypeRepository();

    return new CachedModelsTypeRepository(repository, cache);
}
