// src/modules/attributes/index.ts

import { Module } from "@medusajs/framework/utils";
import AttributeModuleService from "./service/service";

export const ATTRIBUTE_MODULE = "attribute";

export default Module(ATTRIBUTE_MODULE, {
  service: AttributeModuleService,
});
