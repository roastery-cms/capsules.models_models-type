import { describe, expect, it } from "bun:test";
import { Schema } from "@roastery/terroir/schema";
import { UnpackedModelsTypeDTO } from "./unpacked-models-type.dto";
import { makeEntity } from "@roastery/beans/entity/factories";
import { faker } from "@faker-js/faker";

describe("UnpackedModelsTypeDTO", () => {
	const schema = Schema.make(UnpackedModelsTypeDTO);

	const makeValidDTO = () => ({
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

	it("should accept a valid DTO with all required fields", () => {
		const dto = makeValidDTO();

		expect(schema.match(dto)).toBe(true);
	});

	it("should accept a valid DTO with optional updatedAt", () => {
		const dto = {
			...makeValidDTO(),
			updatedAt: faker.date.recent().toISOString(),
		};

		expect(schema.match(dto)).toBe(true);
	});

	it("should reject when name is missing", () => {
		const { name, ...dto } = makeValidDTO();

		expect(schema.match(dto)).toBe(false);
	});

	it("should reject when slug is missing", () => {
		const { slug, ...dto } = makeValidDTO();

		expect(schema.match(dto)).toBe(false);
	});

	it("should reject when description is missing", () => {
		const { description, ...dto } = makeValidDTO();

		expect(schema.match(dto)).toBe(false);
	});

	it("should reject when schema is missing", () => {
		const { schema: _schema, ...dto } = makeValidDTO();

		expect(schema.match(dto)).toBe(false);
	});

	it("should reject when id is missing", () => {
		const { id, ...dto } = makeValidDTO();

		expect(schema.match(dto)).toBe(false);
	});

	it("should reject when createdAt is missing", () => {
		const { createdAt, ...dto } = makeValidDTO();

		expect(schema.match(dto)).toBe(false);
	});

	it("should reject when name is empty string", () => {
		const dto = { ...makeValidDTO(), name: "" };

		expect(schema.match(dto)).toBe(false);
	});

	it("should reject when id is not a valid UUID", () => {
		const dto = { ...makeValidDTO(), id: "not-a-uuid" };

		expect(schema.match(dto)).toBe(false);
	});

	it("should reject when createdAt is not a valid date-time", () => {
		const dto = { ...makeValidDTO(), createdAt: "invalid-date" };

		expect(schema.match(dto)).toBe(false);
	});

	it("should reject non-object values", () => {
		expect(schema.match(null)).toBe(false);
		expect(schema.match(undefined)).toBe(false);
		expect(schema.match("string")).toBe(false);
		expect(schema.match(123)).toBe(false);
	});
});
