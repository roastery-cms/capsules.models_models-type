import { Schema } from "@roastery/terroir/schema";
import { SchemaDTO } from "../dtos/schema.dto";
import type { t } from "@roastery/terroir";

export const SchemaSchema: Schema<t.TString> = Schema.make(SchemaDTO);
