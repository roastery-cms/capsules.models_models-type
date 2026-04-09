import { Entity } from "@roastery/beans";
import { UnpackedModelsTypeSchema } from "./schemas";
import type {
    IConstructorModelsType,
    IMakeModelsType,
    IModelsType,
} from "./types";
import type { Schema } from "@roastery/terroir/schema";
import { AutoUpdate } from "@roastery/beans/entity/decorators";
import {
    DefinedStringVO,
    SlugVO,
} from "@roastery/beans/collections/value-objects";
import { SchemaVO } from "./value-objects";
import {
    EntityContext,
    EntitySchema,
    EntitySource,
} from "@roastery/beans/entity/symbols";
import type { SchemaDTO } from "./dtos";
import type { EntityDTO } from "@roastery/beans/entity/dtos";
import { makeEntity } from "@roastery/beans/entity/factories";

export class ModelsType
    extends Entity<UnpackedModelsTypeSchema>
    implements IModelsType
{
    public override readonly [EntitySource] = "models@models-type";
    public static readonly [EntitySource] = "models@models-type";
    public override readonly [EntitySchema]: Schema<UnpackedModelsTypeSchema> =
        UnpackedModelsTypeSchema;

    private _name: DefinedStringVO;
    private _slug: SlugVO;
    private _description: DefinedStringVO;
    private _schema: SchemaVO;

    private constructor(
        { name, slug, description, schema }: IConstructorModelsType,
        entityProps: EntityDTO,
    ) {
        super(entityProps);

        this._name = DefinedStringVO.make(name, this[EntityContext]("name"));
        this._slug = SlugVO.make(slug, this[EntityContext]("slug"));
        this._description = DefinedStringVO.make(
            description,
            this[EntityContext]("description"),
        );
        this._schema = SchemaVO.make(schema, this[EntityContext]("schema"));
    }

    public static make(
        { description, name, schema, slug }: IMakeModelsType,
        entityProps?: EntityDTO,
    ): IModelsType {
        return new ModelsType(
            { slug: name ?? slug, name, description, schema },
            entityProps ?? makeEntity(),
        );
    }

    @AutoUpdate
    rename(value: string): void {
        this._name = DefinedStringVO.make(value, this[EntityContext]("name"));
    }

    @AutoUpdate
    reslug(value: string): void {
        this._slug = SlugVO.make(value, this[EntityContext]("slug"));
    }

    @AutoUpdate
    changeDescription(value: string): void {
        this._description = DefinedStringVO.make(
            value,
            this[EntityContext]("description"),
        );
    }

    get name(): string {
        return this._name.value;
    }

    get slug(): string {
        return this._slug.value;
    }

    get description(): string {
        return this._description.value;
    }

    get schema(): Schema<typeof SchemaDTO> {
        return this._schema.value;
    }
}
