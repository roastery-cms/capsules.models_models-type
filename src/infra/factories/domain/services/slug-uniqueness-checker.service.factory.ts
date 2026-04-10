import type { IModelsTypeUniquenessCheckerService } from "@/domain/types/services";
import type { IModelsTypeReader } from "@/domain/types/repositories";
import { SlugUniquenessCheckerService } from "@roastery/seedbed/domain/services";

export function makeSlugUniquenessCheckerService(
    repository: IModelsTypeReader,
): IModelsTypeUniquenessCheckerService {
    return new SlugUniquenessCheckerService(repository);
}
