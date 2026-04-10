import { beforeEach, describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { generateUUID } from "@roastery/beans/entity/helpers";
import { makeModelsType } from "@/infra/factories/domain";
import { bootstrap } from "../server";

type App = Awaited<ReturnType<typeof bootstrap>>;

describe("DeleteModelsTypeController", () => {
    let server: App;
    let api: ReturnType<typeof treaty<App>>;
    let env: App["decorator"]["env"];
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
        env = server.decorator.env;
    });

    async function authenticate() {
        const { AUTH_EMAIL: email, AUTH_PASSWORD: password } = env;
        const auth = await api.auth.login.post({ email, password });
        const cookies = auth.response.headers.getSetCookie();
        return { headers: { cookie: cookies.join("; ") } };
    }

    it("should delete a models type and return 204", async () => {
        const options = await authenticate();

        const { status } = await api["models-types"][modelsType.id].delete(
            undefined,
            options,
        );

        expect(status).toBe(204);
    });

    it("should reject unauthenticated requests", async () => {
        const { status } = await api["models-types"][modelsType.id].delete();

        expect(status).not.toBe(204);
    });

    it("should return error for a non-existent id", async () => {
        const options = await authenticate();

        const { status } = await api["models-types"][generateUUID()].delete(
            undefined,
            options,
        );

        expect(status).not.toBe(204);
    });

    it("should not find a models type after deletion", async () => {
        const options = await authenticate();

        await api["models-types"][modelsType.id].delete(undefined, options);

        const { status } = await api["models-types"][modelsType.id].get();

        expect(status).not.toBe(200);
    });
});
