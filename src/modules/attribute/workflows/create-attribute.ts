import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk";
import { createAttributeStep } from "./steps/create-attribute-steps";

import { AttributeRelationCreatePayload } from "../interface.type";
import { createAttributeValuesStep } from "./steps/create-attribute-value-step";

// workflow
export const createAttributeWorkflow = createWorkflow(
  "create-attribute-workflow",
  (input: AttributeRelationCreatePayload) => {
    const { attributeData, valueListData } = input;
    const attributeCreated = createAttributeStep(attributeData);
    const valueListCreated = createAttributeValuesStep({
      target: { id: attributeCreated.id },
      valueListData,
    });
    return new WorkflowResponse({ attributeCreated, valueListCreated });
  },
);
