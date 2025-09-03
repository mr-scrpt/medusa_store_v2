import { jsonString } from "@/shared/lib/zod";
import { AttributeFieldType } from "./type";
import { z } from "zod";

export const AttributeCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  handle: z.string().min(1, "Handle is required"),
  type: z.nativeEnum(AttributeFieldType),
  filterable: z.boolean().default(false),
  metadata: jsonString,
});

export type AttributeFormDefaultValues<
  T extends z.ZodTypeAny = typeof AttributeCreateSchema,
> = z.infer<T>;
