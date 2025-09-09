//  src/modules/attribute/api/endpoint.api.ts
import { sdk } from "@/shared/lib/medusa";
import { AttributeRelationCreatePayload } from "../interface.type";
import { API_ATTRIBUTE_ENDPOINT } from "./route.api";
import { QueryParamsBase } from "@/shared/lib/medusa.type";

export const attributeApi = {
  get: async <T>({
    id,
    query,
  }: {
    id: string;
    query?: QueryParamsBase;
  }): Promise<T> => {
    return sdk.client.fetch(API_ATTRIBUTE_ENDPOINT.QUERY.GET_BY_ID(id), {
      method: "GET",
      query,
    });
  },
  getList: async <T>(query?: QueryParamsBase): Promise<T> => {
    return sdk.client.fetch(API_ATTRIBUTE_ENDPOINT.QUERY.GET_LIST, {
      method: "GET",
      query,
    });
  },
  create: async <T>(data: AttributeRelationCreatePayload): Promise<T> => {
    return sdk.client.fetch(API_ATTRIBUTE_ENDPOINT.MUTATION.CREATE, {
      method: "POST",
      body: data,
    });
  },
};
