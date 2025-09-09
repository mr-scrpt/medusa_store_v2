import { MedusaService } from "@medusajs/framework/utils";
import AttributeSchema from "../models/attribute";
import AttributeValueSchema from "../models/attribute-value";

class AttributeModuleService extends MedusaService({
  Attribute: AttributeSchema,
  AttributeValue: AttributeValueSchema,
}) {}

export default AttributeModuleService;
