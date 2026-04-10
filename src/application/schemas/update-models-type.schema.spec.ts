import { describe, expect, it } from "bun:test";
import { Schema } from "@roastery/terroir/schema";
import { UpdateModelsTypeSchema } from "./update-models-type.schema";

describe("UpdateModelsTypeSchema", () => {
	it("should be an instance of Schema", () => {
		expect(UpdateModelsTypeSchema).toBeInstanceOf(Schema);
	});

	it("should match a valid update DTO", () => {
		expect(
			UpdateModelsTypeSchema.match({
				name: "Review",
				slug: "review",
				description: "A review.",
			}),
		).toBe(true);
	});

	it("should not match an empty object", () => {
		expect(UpdateModelsTypeSchema.match({})).toBe(false);
	});

	it("should match a partial update", () => {
		expect(UpdateModelsTypeSchema.match({ name: "Review" })).toBe(true);
	});

	it("should not match non-object values", () => {
		expect(UpdateModelsTypeSchema.match(null)).toBe(false);
		expect(UpdateModelsTypeSchema.match("string")).toBe(false);
	});
});
