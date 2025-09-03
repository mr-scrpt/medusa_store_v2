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
  fields: "values.*",
};
export type AttributeRelationFieldList = typeof ATTRIBUTE_RELATION_FIELDS;

export type AttributeType = Omit<InferTypeOf<typeof AttributeSchema>, "values">;

export type AttributeRelationType = InferTypeOf<typeof AttributeSchema>;

export type AttributeValueType = InferTypeOf<typeof AttributeValueSchema>;
