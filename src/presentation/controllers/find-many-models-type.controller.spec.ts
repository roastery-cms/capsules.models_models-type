import { beforeEach, describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { makeModelsType } from "@/infra/factories/domain";
import { UuidSchema } from "@roastery/beans/collections/schemas";
import { bootstrap } from "../server";

type App = Awaited<ReturnType<typeof bootstrap>>;

function seedItems(count: number) {
	return Array.from({ length: count }, (_, i) =>
		makeModelsType(
			`ModelsType ${i}`,
			`Description ${i}`,
			UuidSchema.toString(),
		),
	);
}

describe("FindManyModelsTypeController", () => {
	let server: App;
	let api: ReturnType<typeof treaty<App>>;

	beforeEach(async () => {
		server = await bootstrap();

		// biome-ignore lint/suspicious/noExplicitAny: access to test repositories for seed
		const decorator = server.decorator as any;
		await (decorator.cache.flushall?.() ??
			decorator.cache.send?.("FLUSHALL", []));
		decorator.modelsTypeRepository.repository.seed(seedItems(15));

		api = treaty<typeof server>(server);
	});

	it("should return a list of models types with status 200", async () => {
		const { status, data } = await api["models-types"].get({
			query: { page: 1 },
		});

		expect(status).toBe(200);
		expect(data).toBeArray();
		expect(data?.length).toBeGreaterThan(0);
	});

	it("should return pagination headers", async () => {
		const { response } = await api["models-types"].get({
			query: { page: 1 },
		});

		expect(response.headers.get("X-Total-Count")).toBeDefined();
		expect(response.headers.get("X-Total-Pages")).toBeDefined();
	});

	it("should return an empty list for a page with no data", async () => {
		const { status, data } = await api["models-types"].get({
			query: { page: 999 },
		});

		expect(status).toBe(200);
		expect(data).toBeArray();
		expect(data?.length).toBe(0);
	});
});
