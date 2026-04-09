import { describe, expect, it } from "bun:test";
import { ModelsType } from "./models-type";
import { Schema } from "@roastery/terroir/schema";
import { t } from "@roastery/terroir";
import { makeEntity } from "@roastery/beans/entity/factories";

const makeValidSchema = () =>
	Schema.make(t.Object({ content: t.String({ minLength: 1 }) })).toString();

describe("ModelsType", () => {
	describe("make", () => {
		it("should create a valid instance with required fields", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review written by a user.",
				schema: makeValidSchema(),
			});

			expect(entity.name).toBe("Review");
			expect(entity.description).toBe("A review written by a user.");
			expect(entity.schema).toBeInstanceOf(Schema);
		});

		it("should generate id and createdAt when entityProps is not provided", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review.",
				schema: makeValidSchema(),
			});

			expect(entity.id).toBeString();
			expect(entity.createdAt).toBeString();
			expect(entity.updatedAt).toBeUndefined();
		});

		it("should use provided entityProps", () => {
			const entityProps = makeEntity();

			const entity = ModelsType.make(
				{
					name: "Review",
					description: "A review.",
					schema: makeValidSchema(),
				},
				entityProps,
			);

			expect(entity.id).toBe(entityProps.id);
			expect(entity.createdAt).toBe(entityProps.createdAt);
		});

		it("should slugify the name as the slug", () => {
			const entity = ModelsType.make({
				name: "My Cool Product",
				description: "A product.",
				schema: makeValidSchema(),
			});

			expect(entity.slug).toBe("my-cool-product");
		});

		it("should throw when name is empty", () => {
			expect(() =>
				ModelsType.make({
					name: "",
					description: "A review.",
					schema: makeValidSchema(),
				}),
			).toThrow();
		});

		it("should throw when description is empty", () => {
			expect(() =>
				ModelsType.make({
					name: "Review",
					description: "",
					schema: makeValidSchema(),
				}),
			).toThrow();
		});

		it("should throw when schema is invalid JSON", () => {
			expect(() =>
				ModelsType.make({
					name: "Review",
					description: "A review.",
					schema: "not valid json",
				}),
			).toThrow();
		});
	});

	describe("rename", () => {
		it("should update the name", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review.",
				schema: makeValidSchema(),
			});

			entity.rename("Article");

			expect(entity.name).toBe("Article");
		});

		it("should set updatedAt after rename", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review.",
				schema: makeValidSchema(),
			});

			expect(entity.updatedAt).toBeUndefined();

			entity.rename("Article");

			expect(entity.updatedAt).toBeString();
		});

		it("should throw when renaming to empty string", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review.",
				schema: makeValidSchema(),
			});

			expect(() => entity.rename("")).toThrow();
		});
	});

	describe("reslug", () => {
		it("should update the slug", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review.",
				schema: makeValidSchema(),
			});

			entity.reslug("new-slug");

			expect(entity.slug).toBe("new-slug");
		});

		it("should slugify the input value", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review.",
				schema: makeValidSchema(),
			});

			entity.reslug("My New Slug");

			expect(entity.slug).toBe("my-new-slug");
		});

		it("should set updatedAt after reslug", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review.",
				schema: makeValidSchema(),
			});

			expect(entity.updatedAt).toBeUndefined();

			entity.reslug("new-slug");

			expect(entity.updatedAt).toBeString();
		});

		it("should throw when reslugging to empty string", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review.",
				schema: makeValidSchema(),
			});

			expect(() => entity.reslug("")).toThrow();
		});
	});

	describe("changeDescription", () => {
		it("should update the description", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review.",
				schema: makeValidSchema(),
			});

			entity.changeDescription("An updated description.");

			expect(entity.description).toBe("An updated description.");
		});

		it("should set updatedAt after changeDescription", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review.",
				schema: makeValidSchema(),
			});

			expect(entity.updatedAt).toBeUndefined();

			entity.changeDescription("New description.");

			expect(entity.updatedAt).toBeString();
		});

		it("should throw when changing description to empty string", () => {
			const entity = ModelsType.make({
				name: "Review",
				description: "A review.",
				schema: makeValidSchema(),
			});

			expect(() => entity.changeDescription("")).toThrow();
		});
	});
});
