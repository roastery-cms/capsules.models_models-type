import { beforeEach, describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { generateUUID } from "@roastery/beans/entity/helpers";
import { makeModelsType } from "@/infra/factories/domain";
import { bootstrap } from "../server";

type App = Awaited<ReturnType<typeof bootstrap>>;

describe("FindModelsTypeController", () => {
    let server: App;
    let api: ReturnType<typeof treaty<App>>;
    let modelsType: ReturnType<typeof makeModelsType>;

    beforeEach(async () => {
        modelsType = makeModelsType();
        server = await bootstrap();

        // biome-ignore lint/suspicious/noExplicitAny: access to test repositories for seed
        const decorator = server.decorator as any;
        await (decorator.cache.flushall?.() ??
            decorator.cache.send?.("FLUSHALL", []));
        decorator.modelsTypeRepository.repository.seed([modelsType]);

        api = treaty<typeof server>(server);
    });

    it("should find a models type by id and return 200", async () => {
        const { status, data } = await api["models-types"][modelsType.id].get();

        expect(status).toBe(200);
        expect(data?.id).toBe(modelsType.id);
    });

    it("should find a models type by slug and return 200", async () => {
        const { status, data } = await api["models-types"][modelsType.slug].get();

        expect(status).toBe(200);
        expect(data?.slug).toBe(modelsType.slug);
    });

    it("should return the full models type payload", async () => {
        const { data } = await api["models-types"][modelsType.id].get();

        expect(data).toMatchObject({
            id: modelsType.id,
            name: modelsType.name,
            slug: modelsType.slug,
            description: modelsType.description,
        });
        expect(data?.createdAt).toBeDefined();
    });

    it("should return error for a non-existent id", async () => {
        const { status } = await api["models-types"][generateUUID()].get();

        expect(status).not.toBe(200);
    });

    it("should return error for a non-existent slug", async () => {
        const { status } = await api["models-types"]["non-existent-slug"].get();

        expect(status).not.toBe(200);
    });
});
