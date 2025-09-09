//  src/modules/attribute/domain/api.type.ts
import { AttributeFormDefaultValues } from "./attribute.schema";
import { AttributeValueFormDefaultValue } from "./attribute-value.schema";
import { AttributeRelationCreateForm } from "./from-create.schema";
import {
  AttributeRelationType,
  AttributeType,
  AttributeValueType,
} from "./type";
import { MetadataResponse, QueryParamsBase } from "@/shared/lib/medusa.type";

export type AttributeResponse = {
  attribute: AttributeType;
};

export type AttributeValueListResponse = {
  valueList: AttributeValueType[];
};

export type AttributeRelationResponse = {
  attributeData: AttributeRelationType;
};

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
