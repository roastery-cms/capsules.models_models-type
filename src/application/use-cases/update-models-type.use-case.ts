import type { IModelsTypeWriter } from "@/domain/types/repositories";
import type { FindModelsTypeUseCase } from "./find-models-type.use-case";
import type { UpdateModelsTypeDTO } from "@/application/dtos";
import type { IModelsType } from "@/domain/types";
import type { IModelsTypeUniquenessCheckerService } from "@/domain/types/services";
import { UpdateModelsTypeSchema } from "../schemas";
import {
	InvalidOperationException,
	ResourceAlreadyExistsException,
} from "@roastery/terroir/exceptions/application";
import { ModelsType } from "@/domain";
import { EntitySource } from "@roastery/beans/entity/symbols";
import { slugify } from "@roastery/beans/entity/helpers";

export class UpdateModelsTypeUseCase {
	public constructor(
		private readonly writer: IModelsTypeWriter,
		private readonly findModelsType: FindModelsTypeUseCase,
		private readonly uniquenessChecker: IModelsTypeUniquenessCheckerService,
	) {}

	public async run(
		target: string,
		data: UpdateModelsTypeDTO,
		updateSlug: boolean = false,
	): Promise<IModelsType> {
		const { description, name, slug } = data;

		if (!UpdateModelsTypeSchema.match(data))
			throw new InvalidOperationException(
				ModelsType[EntitySource],
				"At least one field must be provided for the update operation.",
			);

		if (name && updateSlug && slug)
			throw new InvalidOperationException(
				ModelsType[EntitySource],
				"You Cannot allow slug updates by name slug when you have a slug set to be changed.",
			);

		const targetEntity = await this.findModelsType.run(target);

		if (name) targetEntity.rename(name);
		if (description) targetEntity.changeDescription(description);

		if (name && updateSlug) {
			await this.validateSlugUniqueness(targetEntity, name);
			targetEntity.reslug(name);
		}

		if (slug) {
			await this.validateSlugUniqueness(targetEntity, slug);
			targetEntity.reslug(slug);
		}

		await this.writer.update(targetEntity);

		return targetEntity;
	}

	private async validateSlugUniqueness(
		modelsType: IModelsType,
		value: string,
	): Promise<void> {
		value = slugify(value);
		if (modelsType.slug === value) return;

		const isUnique = await this.uniquenessChecker.run(value);

		if (!isUnique)
			throw new ResourceAlreadyExistsException(modelsType[EntitySource]);
	}
}
