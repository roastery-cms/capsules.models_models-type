import type { UnpackedModelsTypeDTO } from "@/domain/dtos";
import type { IModelsType } from "@/domain/types";
import type { IModelsTypeReader } from "@/domain/types/repositories";
import { FindEntityByTypeUseCase } from "@roastery/seedbed/application/use-cases";

export function makeFindEntityByUseCase(
    repository: IModelsTypeReader,
): FindEntityByTypeUseCase<
    typeof UnpackedModelsTypeDTO,
    IModelsType,
    IModelsTypeReader
> {
    return new FindEntityByTypeUseCase<
        typeof UnpackedModelsTypeDTO,
        IModelsType,
        IModelsTypeReader
    >(repository);
}
