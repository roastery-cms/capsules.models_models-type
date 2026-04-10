import { t } from "@roastery/terroir";

export const CreateModelsTypeDTO = t.Object(
	{
		name: t.String({
			description: "The name of the models type.",
			examples: ["Review", "Product", "Author"],
			minLength: 1,
		}),
		description: t.String({
			description: "A brief description of the models type.",
			examples: [
				"A review written by a user about a product.",
				"A product available in the store catalog.",
			],
		}),
		schema: t.String({
			description:
				"The serialized TypeBox schema defining the structure of this models type. Must be generated via `SchemaManager`.",
			examples: [
				'{"type":"object","properties":{"content":{"type":"string","minLength":1}},"required":["content"]}',
			],
		}),
	},
	{
		description: "Data transfer object for creating a new models type.",
	},
);

export type CreateModelsTypeDTO = t.Static<typeof CreateModelsTypeDTO>;
