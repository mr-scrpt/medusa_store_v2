//  src/modules/attribute/domain/attribute-value.schema.ts
import { jsonString } from "@/shared/lib/zod";
import { z } from "zod";

export const AttributeValueCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
  rank: z.number().default(0),
  metadata: jsonString,
});

export type AttributeValueFormDefaultValue<
  T extends z.ZodTypeAny = typeof AttributeValueCreateSchema,
> = z.infer<T>;
