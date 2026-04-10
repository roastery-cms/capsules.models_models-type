import { describe, expect, it } from "bun:test";
import { Schema } from "@roastery/terroir/schema";
import { CreateModelsTypeDTO } from "./create-models-type.dto";

describe("CreateModelsTypeDTO", () => {
	const schema = Schema.make(CreateModelsTypeDTO);

	const makeValidDTO = () => ({
		name: "Review",
		description: "A review written by a user.",
		schema: '{"type":"object","properties":{"content":{"type":"string","minLength":1}},"required":["content"]}',
	});

	it("should accept a valid DTO", () => {
		expect(schema.match(makeValidDTO())).toBe(true);
	});

	it("should reject when name is missing", () => {
		const { name, ...dto } = makeValidDTO();

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

	it("should reject when name is empty string", () => {
		expect(schema.match({ ...makeValidDTO(), name: "" })).toBe(false);
	});

	it("should reject non-object values", () => {
		expect(schema.match(null)).toBe(false);
		expect(schema.match("string")).toBe(false);
		expect(schema.match(123)).toBe(false);
	});
});
