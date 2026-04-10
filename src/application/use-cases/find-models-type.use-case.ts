import { ModelsType } from "@/domain";
import type { UnpackedModelsTypeDTO } from "@/domain/dtos";
import type { IModelsType } from "@/domain/types";
import type { IModelsTypeReader } from "@/domain/types/repositories";
import { EntitySource } from "@roastery/beans/entity/symbols";
import type { FindEntityByTypeUseCase } from "@roastery/seedbed/application/use-cases";

export class FindModelsTypeUseCase {
	public constructor(
		private readonly findEntityByType: FindEntityByTypeUseCase<
			typeof UnpackedModelsTypeDTO,
			IModelsType,
			IModelsTypeReader
		>,
	) {}

	public run(value: string): Promise<IModelsType> {
		return this.findEntityByType.run(value, ModelsType[EntitySource]);
	}
}
