import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ATTRIBUTE_MODULE } from "../index";
import { createAttributeWorkflow } from "../workflows/create-attribute";
import { AttributeRelationCreatePayload } from "../domain/api.type";

export async function getAttribute(req: MedusaRequest, res: MedusaResponse) {
  const attributeModuleService = req.scope.resolve(ATTRIBUTE_MODULE);
  const attribute = await attributeModuleService.retrieveAttribute(
    req.params.id,
    req.retrieveConfig,
  );
  res.status(200).json({ attribute });
}

export async function listAttributes(req: MedusaRequest, res: MedusaResponse) {
  const attributeModuleService = req.scope.resolve(ATTRIBUTE_MODULE);
  const [attributeList, count] =
    await attributeModuleService.listAndCountAttributes(
      req.filterableFields,
      req.listConfig,
    );
  res.status(200).json({ attributeList, count });
}

export async function createAttribute(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { result } = await createAttributeWorkflow(req.scope).run({
      input: req.body as AttributeRelationCreatePayload,
    });

    res.status(201).json({
      attribute: result.attributeCreated,
      values: result.valueListCreated,
    });
  } catch (error) {
    console.error("Error creating attribute:", error);
    res.status(500).json({
      error: "Failed to create attribute",
      details: error.message,
    });
  }
}
