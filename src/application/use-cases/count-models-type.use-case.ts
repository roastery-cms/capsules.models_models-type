import type { IModelsTypeReader } from "@/domain/types/repositories";
import { GetNumberOfPagesService } from "@roastery/seedbed/application/services";
import type { ICountItems } from "@roastery/seedbed/application/types";

export class CountModelsTypeUseCase {
	public constructor(private readonly reader: IModelsTypeReader) {}

	public async run(): Promise<ICountItems> {
		const count = await this.reader.count();

		return {
			count,
			totalPages: GetNumberOfPagesService.run(count),
		};
	}
}
