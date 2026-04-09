import { describe, expect, it } from "bun:test";
import { Schema } from "@roastery/terroir/schema";
import { SchemaSchema } from "./schema.schema";

describe("SchemaSchema", () => {
	it("should be an instance of Schema", () => {
		expect(SchemaSchema).toBeInstanceOf(Schema);
	});

	it("should match a valid JSON string", () => {
		const validJson =
			'{"type":"object","properties":{"content":{"type":"string","minLength":1}},"required":["content"]}';

		expect(SchemaSchema.match(validJson)).toBe(true);
	});

	it("should not match a non-JSON string", () => {
		expect(SchemaSchema.match("invalid json")).toBe(false);
	});

	it("should not match an empty string", () => {
		expect(SchemaSchema.match("")).toBe(false);
	});

	it("should not match non-string values", () => {
		expect(SchemaSchema.match(123)).toBe(false);
		expect(SchemaSchema.match(null)).toBe(false);
		expect(SchemaSchema.match({})).toBe(false);
	});

	it("should map a valid JSON string", () => {
		const validJson = '{"type":"string"}';

		const result = SchemaSchema.map(validJson);

		expect(result).toBe(validJson);
	});
});
