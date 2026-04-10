import type { IModelsTypeWriter } from "@/domain/types/repositories";
import type { FindModelsTypeUseCase } from "./find-models-type.use-case";
import type { IModelsType } from "@/domain/types";

export class DeleteModelsTypeUseCase {
    public constructor(
        private readonly writer: IModelsTypeWriter,
        private readonly findModelsType: FindModelsTypeUseCase,
    ) {}

    public async run(value: string): Promise<IModelsType> {
        const targetEntity = await this.findModelsType.run(value);

        await this.writer.delete(targetEntity);

        return targetEntity;
    }
}
