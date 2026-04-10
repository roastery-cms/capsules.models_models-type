import { ModelsType } from "@/domain";
import type { IModelsType, IUnpackedModelsType } from "@/domain/types";
import { Mapper } from "@roastery/beans";
import { InvalidPropertyException } from "@roastery/terroir/exceptions/domain";
import { UnexpectedCacheValueException } from "@roastery/terroir/exceptions/infra";

const ErrorManager = Symbol("error-manager-for-models-type-mapper");

export const ModelsTypeMapper = {
    run: (key: string, _data: string | IUnpackedModelsType): IModelsType => {
        try {
            const data: IUnpackedModelsType =
                typeof _data === "string" ? JSON.parse(_data) : _data;

            return Mapper.toDomain(data, ModelsType.make) as IModelsType;
        } catch (err: unknown) {
            return ModelsTypeMapper[ErrorManager](key, err);
        }
    },
    [ErrorManager]: (key: string, error: unknown): never => {
        if (error instanceof InvalidPropertyException)
            throw new UnexpectedCacheValueException(
                key,
                `${error.source}::${error.property}`,
                error.message,
            );

        throw error;
    },
} as const;
