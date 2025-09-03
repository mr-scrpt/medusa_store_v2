import { z } from "zod";
import { AttributeValueCreateSchema } from "./attribute-value.schema";
import { AttributeCreateSchema } from "./attribute.schema";

export const AttributeRelationCreateFormSchema = z.object({
  attributeData: AttributeCreateSchema,
  valueListData: z.array(AttributeValueCreateSchema),
});

export type AttributeRelationCreateForm = z.infer<
  typeof AttributeRelationCreateFormSchema
>;
