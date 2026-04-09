import { describe, expect, it } from "bun:test";
import { Schema } from "@roastery/terroir/schema";
import { UnpackedModelsTypeSchema } from "./unpacked-models-type.schema";
import { makeEntity } from "@roastery/beans/entity/factories";
import { faker } from "@faker-js/faker";

describe("UnpackedModelsTypeSchema", () => {
	const makeValidData = () => ({
		name: faker.commerce.productName(),
		slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
		description: faker.commerce.productDescription(),
		schema: JSON.stringify({
			type: "object",
			properties: { content: { type: "string", minLength: 1 } },
			required: ["content"],
		}),
		...makeEntity(),
	});

	it("should be an instance of Schema", () => {
		expect(UnpackedModelsTypeSchema).toBeInstanceOf(Schema);
	});

	it("should match valid unpacked models type data", () => {
		const data = makeValidData();

		expect(UnpackedModelsTypeSchema.match(data)).toBe(true);
	});

	it("should match valid data with optional updatedAt", () => {
		const data = {
			...makeValidData(),
			updatedAt: faker.date.recent().toISOString(),
		};

		expect(UnpackedModelsTypeSchema.match(data)).toBe(true);
	});

	it("should not match data with missing required fields", () => {
		const { name, ...data } = makeValidData();

		expect(UnpackedModelsTypeSchema.match(data)).toBe(false);
	});

	it("should not match data with invalid id format", () => {
		const data = { ...makeValidData(), id: "invalid" };

		expect(UnpackedModelsTypeSchema.match(data)).toBe(false);
	});

	it("should not match data with invalid createdAt format", () => {
		const data = { ...makeValidData(), createdAt: "not-a-date" };

		expect(UnpackedModelsTypeSchema.match(data)).toBe(false);
	});

	it("should not match non-object values", () => {
		expect(UnpackedModelsTypeSchema.match(null)).toBe(false);
		expect(UnpackedModelsTypeSchema.match("string")).toBe(false);
		expect(UnpackedModelsTypeSchema.match(42)).toBe(false);
	});

	it("should map valid data and preserve required fields", () => {
		const data = makeValidData();

		const result = UnpackedModelsTypeSchema.map(data);

		expect(result.name).toBe(data.name);
		expect(result.slug).toBe(data.slug);
		expect(result.description).toBe(data.description);
		expect(result.schema).toBe(data.schema);
		expect(result.id).toBe(data.id);
		expect(result.createdAt).toBe(data.createdAt);
	});
});
