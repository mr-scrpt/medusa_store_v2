import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ATTRIBUTE_MODULE } from "../index";
import { createAttributeWorkflow } from "../workflows/create-attribute";
import { AttributeRelationCreatePayload } from "../domain/api.type";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function getAttribute(req: MedusaRequest, res: MedusaResponse) {
  const attributeModuleService = req.scope.resolve(ATTRIBUTE_MODULE);

  const attribute = await attributeModuleService.retrieveAttribute(
    req.params.id,
    req.retrieveConfig,
  );

  res.status(200).json({ attribute });
}

export const listAttributes = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: attributes,
    metadata: { count = 0, take = 15, skip = 0 } = {},
  } = await query.graph({
    entity: ATTRIBUTE_MODULE,
    ...req.queryConfig,
  });

  res.json({
    data: attributes,
    count,
    limit: take,
    offset: skip,
  });
};
// export async function listAttributes(req: MedusaRequest, res: MedusaResponse) {
//   const attributeModuleService = req.scope.resolve(ATTRIBUTE_MODULE);
//
//   const [attributes, count] =
//     await attributeModuleService.listAndCountAttributes(
//       req.filterableFields,
//       req.listConfig,
//     );
//
//   res.status(200).json({
//     data: attributes,
//     count: count,
//   });
// }

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
