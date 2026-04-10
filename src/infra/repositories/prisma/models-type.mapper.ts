import { ModelsType } from "@/domain";
import type { IModelsType, IUnpackedModelsType } from "@/domain/types";
import { parsePrismaDateTimeToISOString } from "@roastery-adapters/models/helpers";
import { Mapper } from "@roastery/beans";

type Input = Omit<IUnpackedModelsType, "createdAt" | "updatedAt"> & {
	id: string;
	createdAt: Date;
	updatedAt: Date | null;
};

export const ModelsTypeMapper = {
	run: (_data: Input): IModelsType => {
		const data: IUnpackedModelsType = parsePrismaDateTimeToISOString(_data);

		return Mapper.toDomain(data, ModelsType.make) as IModelsType;
	},
} as const;
