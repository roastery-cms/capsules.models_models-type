import { describe, expect, it } from "bun:test";
import { Schema } from "@roastery/terroir/schema";
import { SchemaDTO } from "./schema.dto";

describe("SchemaDTO", () => {
	const schema = Schema.make(SchemaDTO);

	it("should accept a valid JSON string", () => {
		const validJson =
			'{"type":"object","properties":{"content":{"type":"string","minLength":1}},"required":["content"]}';

		expect(schema.match(validJson)).toBe(true);
	});

	it("should reject a non-string value", () => {
		expect(schema.match(123)).toBe(false);
		expect(schema.match(null)).toBe(false);
		expect(schema.match(undefined)).toBe(false);
		expect(schema.match({})).toBe(false);
		expect(schema.match([])).toBe(false);
		expect(schema.match(true)).toBe(false);
	});

	it("should reject a non-JSON string", () => {
		expect(schema.match("not a json string")).toBe(false);
	});

	it("should accept a minimal valid JSON string", () => {
		expect(schema.match("{}")).toBe(true);
	});

	it("should accept a JSON array string", () => {
		expect(schema.match("[1, 2, 3]")).toBe(true);
	});

	it("should reject an empty string", () => {
		expect(schema.match("")).toBe(false);
	});
});
