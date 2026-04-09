import { EntityDTO } from "@roastery/beans/entity/dtos";
import { t } from "@roastery/terroir";

export const UnpackedModelsTypeDTO = t.Composite([
	t.Object(
		{
			name: t.String({
				description: "The name of the models type.",
				examples: ["Review", "Product", "Author"],
				minLength: 1,
			}),
			slug: t.String({
				description:
					"The unique slug identifier for the models type (e.g., 'my-adventures').",
				examples: ["my-adventures", "product-catalog", "team-members"],
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
			description:
				"Data transfer object representing the raw models type data.",
		},
	),
	EntityDTO,
]);

export type UnpackedModelsTypeDTO = t.Static<typeof UnpackedModelsTypeDTO>;
