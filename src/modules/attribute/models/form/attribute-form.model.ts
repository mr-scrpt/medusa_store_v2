//  src/modules/attribute/models/form/attribute-form.model.ts
import { combineDefaultSchemas } from "@/shared/lib/react-hook-form";
import { DefaultValues } from "react-hook-form";
import { AttributeValueFormDefaultValue } from "../../domain/attribute-value.schema";
import { AttributeFormDefaultValues } from "../../domain/attribute.schema";
import { AttributeRelationCreateForm } from "../../domain/from-create.schema";
import {
  AttributeFieldType,
  AttributeRelationResponse,
} from "../../interface.type";

export const attributeFormDefaultValues: AttributeFormDefaultValues = {
  name: "",
  handle: "",
  type: AttributeFieldType.SINGLE,
  filterable: false,
  metadata: "",
};

export const attributeValueFormDefaultValues: AttributeValueFormDefaultValue = {
  name: "",
  value: "",
  rank: 0,
  metadata: "",
};

export const attributeRelationFromDefaultValues: AttributeRelationCreateForm =
  combineDefaultSchemas<AttributeRelationCreateForm>({
    attributeData: attributeFormDefaultValues,
    valueListData: [attributeValueFormDefaultValues],
  });

export const buildAttributeToForm = (
  attributeRelationResponse?: AttributeRelationResponse,
): AttributeRelationCreateForm => {
  if (!attributeRelationResponse) {
    return attributeRelationFromDefaultValues;
  }
  attributeRelationResponse;

  return {
    ...attributeRelationResponse,
    attributeData: {
      ...attributeRelationResponse.attributeData,
      metadata: JSON.stringify(
        attributeRelationResponse.attributeData.metadata,
      ),
    },
    valueListData: attributeRelationResponse.valueListData.map((item) => {
      return {
        ...item,
        metadata: JSON.stringify(item.metadata),
      };
    }),
  };
};

export const getAttributeRelationCreateFormDefaultValues = <
  T extends AttributeRelationCreateForm,
>(
  customDefaults?: DefaultValues<T>,
): DefaultValues<T> => {
  return {
    ...attributeRelationFromDefaultValues,
    ...customDefaults,
  } as DefaultValues<T>;
};
