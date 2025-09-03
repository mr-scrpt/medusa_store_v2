import { model } from "@medusajs/framework/utils";
import { AttributeFieldType } from "../domain/type";
import AttributeValueSchema from "./attribute-value";

const AttributeSchema = model.define("attribute", {
  id: model.id().primaryKey(),
  name: model.text(),
  handle: model.text().unique(),
  type: model.enum(AttributeFieldType),
  filterable: model.boolean().default(false),
  metadata: model.json().nullable(),
  values: model.hasMany(() => AttributeValueSchema, {
    foreignKey: "attribute_id",
  }),
});

export default AttributeSchema;
