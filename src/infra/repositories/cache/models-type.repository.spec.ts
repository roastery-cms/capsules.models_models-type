import { beforeEach, describe, expect, it } from "bun:test";
import { makeEntity } from "@roastery/beans/entity/factories";
import { EntitySource } from "@roastery/beans/entity/symbols";
import { type BaristaCacheInstance, cache } from "@roastery-adapters/cache";
import { ModelsType } from "@/domain";
import type { IModelsType } from "@/domain/types";
import { ModelsTypeRepository as TestModelsTypeRepository } from "../test/models-type.repository";
import { ModelsTypeRepository as CachedModelsTypeRepository } from "./models-type.repository";

const makeModelsType = (entityProps = makeEntity()): IModelsType =>
    ModelsType.make(
        {
            name: "Article",
            description: "A content type for articles",
            schema: '{"type":"object","properties":{"content":{"type":"string","minLength":1}},"required":["content"]}',
        },
        entityProps,
    );

const idKey = (id: string) => `${ModelsType[EntitySource]}::$${id}`;
const slugKey = (slug: string) => `${ModelsType[EntitySource]}::${slug}`;

describe("CachedModelsTypeRepository", () => {
    let cacheInstance: BaristaCacheInstance;
    let innerRepository: TestModelsTypeRepository;
    let repository: CachedModelsTypeRepository;

    beforeEach(async () => {
        const app = cache({ CACHE_PROVIDER: "MEMORY" });
        cacheInstance = app.decorator.cache;
        await (
            cacheInstance as unknown as { flushall(): Promise<void> }
        ).flushall();
        innerRepository = new TestModelsTypeRepository();
        repository = new CachedModelsTypeRepository(
            innerRepository,
            cacheInstance,
        );
    });

    describe("create", () => {
        it("should persist in the underlying repository", async () => {
            const modelsType = makeModelsType();

            await repository.create(modelsType);

            expect(await innerRepository.count()).toBe(1);
        });

        it("should cache the models type after creating", async () => {
            const modelsType = makeModelsType();

            await repository.create(modelsType);

            const cached = await cacheInstance.get(idKey(modelsType.id));
            expect(cached).not.toBeNull();
        });

        it("should cache the slug mapping after creating", async () => {
            const modelsType = makeModelsType();

            await repository.create(modelsType);

            const cachedId = await cacheInstance.get(slugKey(modelsType.slug));
            expect(cachedId).toBe(modelsType.id);
        });

        it("should allow findById to return from cache after create", async () => {
            const modelsType = makeModelsType();
            await repository.create(modelsType);

            innerRepository.clear();

            const result = await repository.findById(modelsType.id);
            expect(result).not.toBeNull();
            expect(result!.id).toBe(modelsType.id);
        });
    });

    describe("findById", () => {
        it("should return from repository on cache miss", async () => {
            const modelsType = makeModelsType();
            innerRepository.seed([modelsType]);

            const result = await repository.findById(modelsType.id);

            expect(result).not.toBeNull();
            expect(result!.id).toBe(modelsType.id);
        });

        it("should cache the result after a repository fetch", async () => {
            const modelsType = makeModelsType();
            innerRepository.seed([modelsType]);

            await repository.findById(modelsType.id);

            const cached = await cacheInstance.get(idKey(modelsType.id));
            expect(cached).not.toBeNull();
        });

        it("should return from cache on subsequent calls", async () => {
            const modelsType = makeModelsType();
            innerRepository.seed([modelsType]);

            await repository.findById(modelsType.id);
            innerRepository.clear();

            const result = await repository.findById(modelsType.id);
            expect(result).not.toBeNull();
            expect(result!.id).toBe(modelsType.id);
        });

        it("should reconstruct the entity correctly from cache", async () => {
            const modelsType = makeModelsType();
            innerRepository.seed([modelsType]);

            await repository.findById(modelsType.id);
            innerRepository.clear();

            const result = await repository.findById(modelsType.id);
            expect(result!.name).toBe("Article");
            expect(result!.slug).toBe(modelsType.slug);
            expect(result!.description).toBe("A content type for articles");
        });

        it("should return null when not found in cache or repository", async () => {
            const result = await repository.findById("non-existent");

            expect(result).toBeNull();
        });

        it("should not cache when the result is null", async () => {
            await repository.findById("non-existent");

            const cached = await cacheInstance.get(idKey("non-existent"));
            expect(cached).toBeNull();
        });
    });

    describe("findBySlug", () => {
        it("should return from repository on cache miss", async () => {
            const modelsType = makeModelsType();
            innerRepository.seed([modelsType]);

            const result = await repository.findBySlug(modelsType.slug);

            expect(result).not.toBeNull();
            expect(result!.id).toBe(modelsType.id);
        });

        it("should cache the result after a repository fetch", async () => {
            const modelsType = makeModelsType();
            innerRepository.seed([modelsType]);

            await repository.findBySlug(modelsType.slug);

            const cached = await cacheInstance.get(slugKey(modelsType.slug));
            expect(cached).toBe(modelsType.id);
        });

        it("should return from cache on subsequent calls", async () => {
            const modelsType = makeModelsType();
            innerRepository.seed([modelsType]);

            await repository.findBySlug(modelsType.slug);
            innerRepository.clear();

            const result = await repository.findBySlug(modelsType.slug);
            expect(result).not.toBeNull();
            expect(result!.id).toBe(modelsType.id);
        });

        it("should return null when not found in cache or repository", async () => {
            const result = await repository.findBySlug("non-existent");

            expect(result).toBeNull();
        });

        it("should invalidate stale slug cache when slug changed", async () => {
            const modelsType = makeModelsType();
            innerRepository.seed([modelsType]);

            await repository.findBySlug(modelsType.slug);

            // Simulate slug change: cache has old slug -> id mapping,
            // but the entity now has a different slug
            await cacheInstance.set(
                slugKey("old-slug"),
                modelsType.id,
                "EX",
                3600,
            );

            const result = await repository.findBySlug("old-slug");
            // findBySlug finds the id via cache, calls findById which returns the entity,
            // but entity.slug !== "old-slug", so it invalidates and falls back to repository
            expect(result).toBeNull();
        });
    });

    describe("findMany", () => {
        it("should return from repository on cache miss", async () => {
            const mt1 = makeModelsType();
            const mt2 = makeModelsType();
            innerRepository.seed([mt1, mt2]);

            const result = await repository.findMany(0);

            expect(result).toHaveLength(2);
        });

        it("should cache the page ids after a repository fetch", async () => {
            const mt1 = makeModelsType();
            innerRepository.seed([mt1]);

            await repository.findMany(0);

            const cached = await cacheInstance.get(
                `${ModelsType[EntitySource]}:page::0`,
            );
            expect(cached).not.toBeNull();
        });

        it("should return from cache on subsequent calls", async () => {
            const mt1 = makeModelsType();
            const mt2 = makeModelsType();
            innerRepository.seed([mt1, mt2]);

            await repository.findMany(0);
            innerRepository.clear();

            const result = await repository.findMany(0);
            expect(result).toHaveLength(2);
        });

        it("should cache individual items after a repository fetch", async () => {
            const mt1 = makeModelsType();
            const mt2 = makeModelsType();
            innerRepository.seed([mt1, mt2]);

            await repository.findMany(0);

            const cached1 = await cacheInstance.get(idKey(mt1.id));
            const cached2 = await cacheInstance.get(idKey(mt2.id));
            expect(cached1).not.toBeNull();
            expect(cached2).not.toBeNull();
        });

        it("should fetch from repository when page ids are cached but individual items expired", async () => {
            const mt1 = makeModelsType();
            const mt2 = makeModelsType();
            innerRepository.seed([mt1, mt2]);

            await repository.findMany(0);

            // Remove individual item caches but keep page id cache
            await cacheInstance.del(idKey(mt1.id));
            await cacheInstance.del(idKey(mt2.id));

            const result = await repository.findMany(0);
            expect(result).toHaveLength(2);
            expect(result[0]!.id).toBe(mt1.id);
            expect(result[1]!.id).toBe(mt2.id);
        });

        it("should return empty array when no results", async () => {
            const result = await repository.findMany(0);

            expect(result).toHaveLength(0);
        });
    });

    describe("update", () => {
        it("should persist the update in the underlying repository", async () => {
            const entityProps = makeEntity();
            const modelsType = makeModelsType(entityProps);
            innerRepository.seed([modelsType]);

            const updated = ModelsType.make(
                {
                    name: "Updated Article",
                    description: "Updated description",
                    schema: '{"type":"object","properties":{"content":{"type":"string","minLength":1}},"required":["content"]}',
                },
                entityProps,
            );
            await repository.update(updated);

            const result = await innerRepository.findById(entityProps.id);
            expect(result!.name).toBe("Updated Article");
        });

        it("should update the cached value", async () => {
            const entityProps = makeEntity();
            const modelsType = makeModelsType(entityProps);
            await repository.create(modelsType);

            const updated = ModelsType.make(
                {
                    name: "Updated Article",
                    description: "Updated description",
                    schema: '{"type":"object","properties":{"content":{"type":"string","minLength":1}},"required":["content"]}',
                },
                entityProps,
            );
            await repository.update(updated);

            innerRepository.clear();

            const result = await repository.findById(entityProps.id);
            expect(result!.name).toBe("Updated Article");
        });

        it("should invalidate stale cache before updating", async () => {
            const entityProps = makeEntity();
            const modelsType = makeModelsType(entityProps);
            await repository.create(modelsType);

            const updated = ModelsType.make(
                {
                    name: "New Name",
                    description: "New description",
                    schema: '{"type":"object","properties":{"content":{"type":"string","minLength":1}},"required":["content"]}',
                },
                entityProps,
            );
            await repository.update(updated);

            innerRepository.clear();

            const result = await repository.findById(entityProps.id);
            expect(result!.name).not.toBe("Article");
            expect(result!.name).toBe("New Name");
        });
    });

    describe("delete", () => {
        it("should remove from the underlying repository", async () => {
            const modelsType = makeModelsType();
            innerRepository.seed([modelsType]);

            await repository.delete(modelsType);

            expect(await innerRepository.count()).toBe(0);
        });

        it("should remove cached entries after delete", async () => {
            const modelsType = makeModelsType();
            await repository.create(modelsType);

            await repository.delete(modelsType);

            const cachedById = await cacheInstance.get(idKey(modelsType.id));
            const cachedBySlug = await cacheInstance.get(
                slugKey(modelsType.slug),
            );
            expect(cachedById).toBeNull();
            expect(cachedBySlug).toBeNull();
        });

        it("should return null on findById after delete", async () => {
            const modelsType = makeModelsType();
            await repository.create(modelsType);

            await repository.delete(modelsType);

            const result = await repository.findById(modelsType.id);
            expect(result).toBeNull();
        });
    });

    describe("count", () => {
        it("should delegate to the underlying repository", async () => {
            const mt1 = makeModelsType();
            const mt2 = makeModelsType();
            innerRepository.seed([mt1, mt2]);

            const result = await repository.count();

            expect(result).toBe(2);
        });
    });
});
