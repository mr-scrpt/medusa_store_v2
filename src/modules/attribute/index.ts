// src/modules/my-module/index.ts
import { Module } from "@medusajs/framework/utils";
import AttributeModuleService from "./service/attribute.service";

export const MODULE_ATTRIBUTE_NAME = "attribute";
export default Module(MODULE_ATTRIBUTE_NAME, {
  service: AttributeModuleService,
});
