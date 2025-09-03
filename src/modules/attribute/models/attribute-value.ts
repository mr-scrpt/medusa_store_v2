import { model } from "@medusajs/framework/utils";
import AttributeSchema from "./attribute";

const AttributeValueSchema = model.define("attribute_value", {
  id: model.id().primaryKey(),
  name: model.text(),
  value: model.text(),
  rank: model.number().default(0),
  metadata: model.json().nullable(),
  attribute: model.belongsTo(() => AttributeSchema, {
    foreignKey: "attribute_id",
  }),
});

export default AttributeValueSchema;
