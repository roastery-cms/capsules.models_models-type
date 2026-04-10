import { t } from "@roastery/terroir";

export const UpdateModelsTypeDTO = t.Object(
    {
        name: t.Optional(
            t.String({
                description: "The name of the models type.",
                examples: ["Review", "Product", "Author"],
                minLength: 1,
            }),
        ),
        slug: t.Optional(
            t.String({
                description:
                    "The unique slug identifier for the models type (e.g., 'my-adventures').",
                examples: ["my-adventures", "product-catalog", "team-members"],
            }),
        ),
        description: t.Optional(
            t.String({
                description: "A brief description of the models type.",
                examples: [
                    "A review written by a user about a product.",
                    "A product available in the store catalog.",
                ],
            }),
        ),
    },
    {
        description:
            "Data transfer object for updating an existing models type.",
        minProperties: 1,
    },
);

export type UpdateModelsTypeDTO = t.Static<typeof UpdateModelsTypeDTO>;
