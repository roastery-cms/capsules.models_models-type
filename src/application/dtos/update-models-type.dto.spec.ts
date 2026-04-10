import { describe, expect, it } from "bun:test";
import { Schema } from "@roastery/terroir/schema";
import { UpdateModelsTypeDTO } from "./update-models-type.dto";

describe("UpdateModelsTypeDTO", () => {
	const schema = Schema.make(UpdateModelsTypeDTO);

	it("should accept a DTO with all optional fields", () => {
		expect(
			schema.match({ name: "Review", slug: "review", description: "A review." }),
		).toBe(true);
	});

	it("should accept a DTO with only name", () => {
		expect(schema.match({ name: "Review" })).toBe(true);
	});

	it("should accept a DTO with only slug", () => {
		expect(schema.match({ slug: "review" })).toBe(true);
	});

	it("should accept a DTO with only description", () => {
		expect(schema.match({ description: "A review." })).toBe(true);
	});

	it("should reject an empty object", () => {
		expect(schema.match({})).toBe(false);
	});

	it("should reject when name is empty string", () => {
		expect(schema.match({ name: "" })).toBe(false);
	});

	it("should reject non-object values", () => {
		expect(schema.match(null)).toBe(false);
		expect(schema.match("string")).toBe(false);
		expect(schema.match(123)).toBe(false);
	});
});
