//  src/modules/attribute/domain/api.type.ts
import { AttributeFormDefaultValues } from "./attribute.schema";
import { AttributeValueFormDefaultValue } from "./attribute-value.schema";
import { AttributeRelationCreateForm } from "./from-create.schema";
import {
  AttributeRelationType,
  AttributeType,
  AttributeValueType,
} from "./type";

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

export type AttributeListResponse = MetadataResponse & {
  attributeList: AttributeType[];
};

export type AttributeRelationListResponse = MetadataResponse & {
  attributeList: AttributeRelationType[];
};

// Payload
export type AttributeCreatePayload = AttributeFormDefaultValues;
export type AttributeValueCreatePayload = AttributeValueFormDefaultValue;

export type AttributeRelationCreatePayload = AttributeRelationCreateForm;
