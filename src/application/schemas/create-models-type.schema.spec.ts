import { describe, expect, it } from "bun:test";
import { Schema } from "@roastery/terroir/schema";
import { CreateModelsTypeSchema } from "./create-models-type.schema";

describe("CreateModelsTypeSchema", () => {
	it("should be an instance of Schema", () => {
		expect(CreateModelsTypeSchema).toBeInstanceOf(Schema);
	});

	it("should match a valid create DTO", () => {
		expect(
			CreateModelsTypeSchema.match({
				name: "Review",
				description: "A review.",
				schema: '{"type":"string"}',
			}),
		).toBe(true);
	});

	it("should not match when required fields are missing", () => {
		expect(CreateModelsTypeSchema.match({ name: "Review" })).toBe(false);
	});

	it("should not match non-object values", () => {
		expect(CreateModelsTypeSchema.match(null)).toBe(false);
		expect(CreateModelsTypeSchema.match("string")).toBe(false);
	});
});
