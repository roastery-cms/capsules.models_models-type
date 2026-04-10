import { describe, expect, it } from "bun:test";
import { makeEntity } from "@roastery/beans/entity/factories";
import { ModelsType } from "@/domain";
import { ModelsTypeMapper } from "./models-type.mapper";

const entity = makeEntity();

const makeInput = (
    overrides?: Partial<Parameters<typeof ModelsTypeMapper.run>[0]>,
): Parameters<typeof ModelsTypeMapper.run>[0] => ({
    id: entity.id,
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: null,
    name: "Article",
    slug: "article",
    description: "A content type for articles",
    schema: '{"type":"object","properties":{"content":{"type":"string","minLength":1}},"required":["content"]}',
    ...overrides,
});

describe("ModelsTypeMapper", () => {
    it("should return a ModelsType instance", () => {
        const result = ModelsTypeMapper.run(makeInput());

        expect(result).toBeInstanceOf(ModelsType);
    });

    it("should map id and createdAt from prisma output", () => {
        const result = ModelsTypeMapper.run(makeInput());

        expect(result.id).toBe(entity.id);
        expect(result.createdAt).toBe("2025-01-01T00:00:00.000Z");
    });

    it("should map updatedAt when present", () => {
        const result = ModelsTypeMapper.run(
            makeInput({ updatedAt: new Date("2025-06-15T12:00:00.000Z") }),
        );

        expect(result.updatedAt).toBe("2025-06-15T12:00:00.000Z");
    });

    it("should map updatedAt as null when not present", () => {
        const result = ModelsTypeMapper.run(makeInput());

        expect(result.updatedAt).toBeUndefined();
    });

    it("should map name correctly", () => {
        const result = ModelsTypeMapper.run(makeInput());

        expect(result.name).toBe("Article");
    });

    it("should map slug correctly", () => {
        const result = ModelsTypeMapper.run(makeInput());

        expect(result.slug).toBe("article");
    });

    it("should map description correctly", () => {
        const result = ModelsTypeMapper.run(makeInput());

        expect(result.description).toBe("A content type for articles");
    });

    it("should map schema correctly", () => {
        const result = ModelsTypeMapper.run(makeInput());

        expect(JSON.parse(result.schema.toString())).toEqual({
            type: "object",
            properties: { content: { type: "string", minLength: 1 } },
            required: ["content"],
        });
    });
});
