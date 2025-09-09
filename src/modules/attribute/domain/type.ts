//  src/modules/attribute/domain/type.ts
import { InferTypeOf } from "@medusajs/framework/types";
import AttributeSchema from "../models/attribute";
import AttributeValueSchema from "../models/attribute-value";

export enum AttributeFieldType {
  MULTI = "multi",
  SINGLE = "single",
  BOOLEAN = "boolean",
  RANGE = "range",
}

export const ATTRIBUTE_RELATION_FIELDS = {
  fields: "valueList.*",
};
export type AttributeRelationFieldList = typeof ATTRIBUTE_RELATION_FIELDS;

export type AttributeType = Omit<
  InferTypeOf<typeof AttributeSchema>,
  "valueList"
>;
export type AttributeValueType = InferTypeOf<typeof AttributeValueSchema>;

// export type AttributeRelationType = InferTypeOf<typeof AttributeSchema>;
