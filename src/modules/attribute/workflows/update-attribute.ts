// import { AttributeType } from "@/modules/attribute/domain/type";
// import {
//   createWorkflow,
//   transform,
//   WorkflowData,
//   WorkflowResponse,
// } from "@medusajs/workflows-sdk";
// import {
//   updateAttributeStep,
//   updateAttributeValuesStep,
// } from "./steps/update-attribute-steps";
//
// export type WorkflowInput = {
//   id: string;
//   name?: string;
//   handle?: string;
//   type?: string;
//   filterable?: boolean;
//   metadata?: Record<string, unknown>;
//   values?: {
//     id?: string;
//     value: string;
//     rank?: number;
//     metadata?: Record<string, unknown>;
//   }[];
// };
//
// export const updateAttributeWorkflow = createWorkflow(
//   "update-attribute-workflow",
//   (input: WorkflowData<WorkflowInput>) => {
//     const updatedAttribute = updateAttributeStep(input);
//
//     const valuesInput = transform(
//       { updatedAttribute, input },
//       (data: { updatedAttribute: AttributeType; input: WorkflowInput }) => {
//         if (!data.input.values || data.input.values.length === 0) {
//           return {
//             attribute_id: data.updatedAttribute.id,
//             values: [],
//           };
//         }
//         return {
//           attribute_id: data.updatedAttribute.id,
//           values: data.input.values,
//         };
//       },
//     );
//
//     updateAttributeValuesStep(valuesInput);
//
//     return new WorkflowResponse(updatedAttribute);
//   },
// );
