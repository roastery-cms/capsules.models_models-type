import { describe, expect, it } from "bun:test";
import { Mapper } from "@roastery/beans";
import { makeEntity } from "@roastery/beans/entity/factories";
import { UnexpectedCacheValueException } from "@roastery/terroir/exceptions/infra";
import { ModelsType } from "@/domain";
import { ModelsTypeMapper } from "./models-type.mapper";

const entity = makeEntity();

const makeModelsType = () =>
	ModelsType.make(
		{
			name: "Article",
			slug: "article",
			description: "A content type for articles",
			schema:
				'{"type":"object","properties":{"content":{"type":"string","minLength":1}},"required":["content"]}',
		},
		entity,
	);

const serialize = (modelsType = makeModelsType()): string =>
	JSON.stringify(Mapper.toDTO(modelsType));

const cacheKey = "models@models-type::$test-id";

describe("ModelsTypeMapper", () => {
	it("should return a ModelsType instance from string input", () => {
		const result = ModelsTypeMapper.run(cacheKey, serialize());

		expect(result).toBeInstanceOf(ModelsType);
	});

	it("should return a ModelsType instance from object input", () => {
		const result = ModelsTypeMapper.run(
			cacheKey,
			Mapper.toDTO(makeModelsType()),
		);

		expect(result).toBeInstanceOf(ModelsType);
	});

	it("should map id and createdAt from cached data", () => {
		const result = ModelsTypeMapper.run(cacheKey, serialize());

		expect(result.id).toBe(entity.id);
		expect(result.createdAt).toBe(entity.createdAt);
	});

	it("should map name correctly", () => {
		const result = ModelsTypeMapper.run(cacheKey, serialize());

		expect(result.name).toBe("Article");
	});

	it("should map slug correctly", () => {
		const result = ModelsTypeMapper.run(cacheKey, serialize());

		expect(result.slug).toBe("article");
	});

	it("should map description correctly", () => {
		const result = ModelsTypeMapper.run(cacheKey, serialize());

		expect(result.description).toBe("A content type for articles");
	});

	it("should map schema correctly", () => {
		const result = ModelsTypeMapper.run(cacheKey, serialize());

		expect(JSON.parse(result.schema.toString())).toEqual({
			type: "object",
			properties: { content: { type: "string", minLength: 1 } },
			required: ["content"],
		});
	});

	it("should throw UnexpectedCacheValueException when string input has invalid domain data", () => {
		const data = JSON.parse(serialize());
		data.name = "";

		expect(() => ModelsTypeMapper.run(cacheKey, JSON.stringify(data))).toThrow(
			UnexpectedCacheValueException,
		);
	});

	it("should throw UnexpectedCacheValueException when object input has invalid domain data", () => {
		const data = Mapper.toDTO(makeModelsType());
		data.description = "";

		expect(() => ModelsTypeMapper.run(cacheKey, data)).toThrow(
			UnexpectedCacheValueException,
		);
	});

	it("should rethrow non-domain errors from string input", () => {
		expect(() => ModelsTypeMapper.run(cacheKey, "null")).toThrow(TypeError);
	});

	it("should rethrow non-domain errors from object input", () => {
		expect(() =>
			ModelsTypeMapper.run(
				cacheKey,
				null as unknown as Parameters<typeof ModelsTypeMapper.run>[1],
			),
		).toThrow(TypeError);
	});

	it("should throw SyntaxError when string input is not valid JSON", () => {
		expect(() => ModelsTypeMapper.run(cacheKey, "invalid-json")).toThrow(
			SyntaxError,
		);
	});
});
