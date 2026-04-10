import type { IModelsType } from "@/domain/types";
import type { IModelsTypeWriter } from "@/domain/types/repositories";
import type { CreateModelsTypeDTO } from "../dtos";
import { ModelsType } from "@/domain";
import { ResourceAlreadyExistsException } from "@roastery/terroir/exceptions/application";
import { EntitySource } from "@roastery/beans/entity/symbols";
import type { IModelsTypeUniquenessCheckerService } from "@/domain/types/services";

export class CreateModelsTypeUseCase {
    public constructor(
        private readonly writer: IModelsTypeWriter,
        private readonly uniquenessChecker: IModelsTypeUniquenessCheckerService,
    ) {}

    public async run({
        description,
        name,
        schema,
    }: CreateModelsTypeDTO): Promise<IModelsType> {
        const modelsType = ModelsType.make({ description, name, schema });
        const isUnique = await this.uniquenessChecker.run(modelsType.slug);

        if (!isUnique)
            throw new ResourceAlreadyExistsException(ModelsType[EntitySource]);

        await this.writer.create(modelsType);

        return modelsType;
    }
}
