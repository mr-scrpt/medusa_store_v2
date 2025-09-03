import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ATTRIBUTE_MODULE } from "../..";
import AttributeModuleService from "../../service/service";
import { AttributeValueCreatePayload } from "../../interface.type";
import { getMetadata } from "../../tool/metadata";

export const createAttributeValuesStep = createStep(
  "create-attribute-values-step",
  async (
    data: {
      target: { id: string };
      valueListData: AttributeValueCreatePayload[];
    },
    { container },
  ) => {
    console.log("output_log: DATA =>>>", data);
    const attributeModuleService =
      container.resolve<AttributeModuleService>(ATTRIBUTE_MODULE);

    const valuesWithAttributeId = data.valueListData.map((value) => ({
      ...value,
      attribute_id: data.target.id,
      metadata: getMetadata(value.metadata),
    }));

    const createdValues = await attributeModuleService.createAttributeValues(
      valuesWithAttributeId,
    );

    return new StepResponse(createdValues, {
      idList: createdValues.map((v) => v.id),
    });
  },
  async (undoData, { container }) => {
    if (!undoData?.idList?.length) return;

    const attributeModuleService =
      container.resolve<AttributeModuleService>(ATTRIBUTE_MODULE);

    console.log(
      `Compensation: Deleting attribute values with ids ${undoData.idList.join(", ")}`,
    );
    await attributeModuleService.deleteAttributeValues(undoData.idList);
  },
);
