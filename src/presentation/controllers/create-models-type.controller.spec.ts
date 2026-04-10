import { beforeEach, describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { faker } from "@faker-js/faker";
import { UuidSchema } from "@roastery/beans/collections/schemas";
import { bootstrap } from "../server";

type App = Awaited<ReturnType<typeof bootstrap>>;

function makeBody(overrides?: Record<string, unknown>) {
    return {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        schema: UuidSchema.toString(),
        ...overrides,
    };
}

describe("CreateModelsTypeController", () => {
    let server: App;
    let api: ReturnType<typeof treaty<App>>;
    let env: App["decorator"]["env"];

    beforeEach(async () => {
        server = await bootstrap();

        // biome-ignore lint/suspicious/noExplicitAny: access to test repositories for seed
        const decorator = server.decorator as any;
        await (decorator.cache.flushall?.() ??
            decorator.cache.send?.("FLUSHALL", []));

        api = treaty<typeof server>(server);
        env = server.decorator.env;
    });

    async function authenticate() {
        const { AUTH_EMAIL: email, AUTH_PASSWORD: password } = env;
        const auth = await api.auth.login.post({ email, password });
        const cookies = auth.response.headers.getSetCookie();
        return { headers: { cookie: cookies.join("; ") } };
    }

    it("should create a models type and return 201", async () => {
        const options = await authenticate();

        const { status } = await api["models-types"].post(makeBody(), options);

        expect(status).toBe(201);
    });

    it("should return the full models type payload on creation", async () => {
        const options = await authenticate();
        const body = makeBody();

        const { data } = await api["models-types"].post(body, options);

        expect(data).toMatchObject({
            name: body.name,
            description: body.description,
        });
        expect(data?.id).toBeDefined();
        expect(data?.slug).toBeDefined();
        expect(data?.createdAt).toBeDefined();
        expect(data?.updatedAt).toBeUndefined();
    });

    it("should reject unauthenticated requests", async () => {
        const { status } = await api["models-types"].post(makeBody());

        expect(status).not.toBe(201);
    });

    it("should reject a request with an empty name", async () => {
        const options = await authenticate();

        const { status } = await api["models-types"].post(
            { ...makeBody(), name: "" } as never,
            options,
        );

        expect(status).toBe(422);
    });

    it("should reject a request with a missing description", async () => {
        const options = await authenticate();

        const { status } = await api["models-types"].post(
            {
                name: faker.commerce.productName(),
                schema: UuidSchema.toString(),
            } as never,
            options,
        );

        expect(status).toBe(422);
    });

    it("should not allow duplicate models type with the same slug", async () => {
        const options = await authenticate();
        const body = makeBody();

        const first = await api["models-types"].post(body, options);
        expect(first.status).toBe(201);

        const second = await api["models-types"].post(body, options);
        expect(second.status).not.toBe(201);
    });
});
