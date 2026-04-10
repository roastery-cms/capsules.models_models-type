import { beforeEach, describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { faker } from "@faker-js/faker";
import { generateUUID } from "@roastery/beans/entity/helpers";
import { makeModelsType } from "@/infra/factories/domain";
import { bootstrap } from "../server";

type App = Awaited<ReturnType<typeof bootstrap>>;

describe("UpdateModelsTypeController", () => {
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

	it("should update a models type and return 200", async () => {
		const options = await authenticate();

		const { status } = await api["models-types"]({
			"id-or-slug": modelsType.id,
		}).patch({ name: "Updated Name" }, options);

		expect(status).toBe(200);
	});

	it("should return the updated models type payload", async () => {
		const options = await authenticate();
		const newName = faker.commerce.productName();

		const { data } = await api["models-types"]({
			"id-or-slug": modelsType.id,
		}).patch({ name: newName }, options);

		expect(data?.name).toBe(newName);
		expect(data?.updatedAt).toBeDefined();
	});

	it("should update only the description", async () => {
		const options = await authenticate();
		const newDescription = faker.lorem.sentence();

		const { data } = await api["models-types"]({
			"id-or-slug": modelsType.id,
		}).patch({ description: newDescription }, options);

		expect(data?.description).toBe(newDescription);
		expect(data?.name).toBe(modelsType.name);
	});

	it("should update the slug when update-slug query is true", async () => {
		const options = await authenticate();
		const originalSlug = modelsType.slug;

		const { data } = await api["models-types"]({
			"id-or-slug": modelsType.id,
		}).patch(
			{ name: "Completely Different Name" },
			{ ...options, query: { "update-slug": true } },
		);

		expect(data?.name).toBe("Completely Different Name");
		expect(data?.slug).not.toBe(originalSlug);
	});

	it("should reject unauthenticated requests", async () => {
		const { status } = await api["models-types"]({
			"id-or-slug": modelsType.id,
		}).patch({ name: "Updated" });

		expect(status).not.toBe(200);
	});

	it("should reject an empty body", async () => {
		const options = await authenticate();

		const { status } = await api["models-types"]({
			"id-or-slug": modelsType.id,
		}).patch({} as never, options);

		expect(status).toBe(422);
	});

	it("should return error for a non-existent id", async () => {
		const options = await authenticate();

		const { status } = await api["models-types"]({
			"id-or-slug": generateUUID(),
		}).patch({ name: "Updated" }, options);

		expect(status).not.toBe(200);
	});
});
