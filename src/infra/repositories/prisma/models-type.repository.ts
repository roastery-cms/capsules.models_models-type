import { ModelsType } from "@/domain";
import type { IModelsType } from "@/domain/types";
import type { IModelsTypeRepository } from "@/domain/types/repositories";
import type { PrismaClient } from "@roastery-adapters/models";
import { SafePrisma } from "@roastery-adapters/models/decorators";
import { Mapper } from "@roastery/beans";
import { EntitySource } from "@roastery/beans/entity/symbols";
import { MAX_ITEMS_PER_QUERY } from "@roastery/seedbed/constants";
import { ModelsTypeMapper } from "./models-type.mapper";

export class ModelsTypeRepository implements IModelsTypeRepository {
    public constructor(private readonly prisma: PrismaClient) {}

    @SafePrisma(ModelsType[EntitySource])
    async create(data: IModelsType): Promise<void> {
        await this.prisma.modelType.create({ data: Mapper.toDTO(data) });
    }

    @SafePrisma(ModelsType[EntitySource])
    async update(_data: IModelsType): Promise<void> {
        const { id, ...data } = Mapper.toDTO(_data);

        await this.prisma.modelType.update({ where: { id }, data });
    }

    @SafePrisma(ModelsType[EntitySource])
    async delete(data: IModelsType): Promise<void> {
        await this.prisma.modelType.delete({ where: { id: data.id } });
    }

    @SafePrisma(ModelsType[EntitySource])
    async findMany(page: number): Promise<IModelsType[]> {
        return (
            await this.prisma.modelType.findMany({
                skip: MAX_ITEMS_PER_QUERY * (page - 1),
                take: MAX_ITEMS_PER_QUERY,
            })
        ).map((item) => ModelsTypeMapper.run(item));
    }

    @SafePrisma(ModelsType[EntitySource])
    count(): Promise<number> {
        return this.prisma.modelType.count();
    }

    @SafePrisma(ModelsType[EntitySource])
    async findById(id: string): Promise<IModelsType | null> {
        const targetEntity = await this.prisma.modelType.findFirst({
            where: { id },
        });

        if (!targetEntity) return null;

        return ModelsTypeMapper.run(targetEntity);
    }

    @SafePrisma(ModelsType[EntitySource])
    async findBySlug(slug: string): Promise<IModelsType | null> {
        const targetEntity = await this.prisma.modelType.findFirst({
            where: { slug },
        });

        if (!targetEntity) return null;

        return ModelsTypeMapper.run(targetEntity);
    }
}
