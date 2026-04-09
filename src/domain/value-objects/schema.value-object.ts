import { type Schema, SchemaManager } from "@roastery/terroir/schema";
import type { SchemaDTO } from "../dtos";
import { SchemaSchema } from "../schemas";
import { ValueObject } from "@roastery/beans";
import type { t } from "@roastery/terroir";
import type { IValueObjectMetadata } from "@roastery/beans/value-object/types";
import { InvalidPropertyException } from "@roastery/terroir/exceptions/domain";

export class SchemaVO extends ValueObject<
    Schema<typeof SchemaDTO>,
    typeof SchemaDTO
> {
    protected override schema: Schema<t.TString>;

    private constructor(
        value: Schema<typeof SchemaDTO>,
        info: IValueObjectMetadata,
    ) {
        super(value, info);
        this.schema = SchemaSchema;
    }

    public static make(value: string, info: IValueObjectMetadata): SchemaVO {
        const newVO = new SchemaVO(SchemaVO.tryBuildSchema(value, info), info);

        newVO.validate();

        return newVO;
    }

    private static tryBuildSchema(
        value: string,
        info: IValueObjectMetadata,
    ): Schema<t.TString> {
        try {
            return SchemaManager.build(value);
        } catch (_) {
            throw new InvalidPropertyException(info.name, info.source);
        }
    }

    protected override validate(): void {
        if (!SchemaManager.isSchema(this.value.toJSON())) {
            throw new InvalidPropertyException(
                this.info.name,
                this.info.source,
            );
        }
    }
}
