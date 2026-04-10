import type { IModelsTypeReader } from "@/domain/types/repositories";
import type { CountModelsTypeUseCase } from "./count-models-type.use-case";
import type { IFindManyModelsTypeUseCaseOutput } from "../types";

export class FindManyModelsTypeUseCase {
	public constructor(
		private readonly reader: IModelsTypeReader,
		private readonly countModelsType: CountModelsTypeUseCase,
	) {}

	public async run(page: number): Promise<IFindManyModelsTypeUseCaseOutput> {
		const { count, totalPages } = await this.countModelsType.run();
		const value = await this.reader.findMany(page);

		return { value, count, totalPages };
	}
}
