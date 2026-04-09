import type { UnpackedModelsTypeSchema } from "@/domain/schemas";
import type {
    ICanReadId,
    ICanReadSlug,
} from "@roastery/seedbed/domain/types/repositories";
import type { IModelsType } from "@/domain/types";

export interface IModelsTypeReader
    extends
        ICanReadId<UnpackedModelsTypeSchema, IModelsType>,
        ICanReadSlug<UnpackedModelsTypeSchema, IModelsType> {
    findMany(page: number): Promise<IModelsType[]>;
    count(): Promise<number>;
}
