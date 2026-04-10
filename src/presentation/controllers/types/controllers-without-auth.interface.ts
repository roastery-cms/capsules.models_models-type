import type { IModelsTypeRepository } from "@/domain/types/repositories";

export interface IControllersWithoutAuth {
    modelsTypeRepository: IModelsTypeRepository;
}
