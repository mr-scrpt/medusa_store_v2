//  src/modules/attribute/domain/api.type.ts
import { AttributeFormDefaultValues } from "./attribute.schema";
import { AttributeValueFormDefaultValue } from "./attribute-value.schema";
import { AttributeRelationCreateForm } from "./from-create.schema";
import { AttributeType, AttributeValueType } from "./type";

export type AttributeListParams = {
  q?: string;
  limit?: number;
  offset?: number;
  order?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  handle?: string;
};

type MetadataResponse = {
  count: number;
  offset: number;
  limit: number;
};

export type AttributeResponse = {
  attributeData: AttributeType;
};

export type AttributeValueListResponse = {
  valueListData: AttributeValueType[];
};

export type AttributeRelationResponse = AttributeResponse &
  AttributeValueListResponse;

export type AttributeListResponse = {
  attributeList: AttributeType[];
} & MetadataResponse;

export type AttributeRelationListResponse = {
  data: Array<AttributeRelationResponse>;
} & MetadataResponse;

// Payload
export type AttributeCreatePayload = AttributeFormDefaultValues;
export type AttributeValueCreatePayload = AttributeValueFormDefaultValue;

export type AttributeRelationCreatePayload = AttributeRelationCreateForm;
