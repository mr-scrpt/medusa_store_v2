//  src/modules/attribute/models/query/use-attribute.query.ts
import { useQuery } from "@tanstack/react-query";

import { attributeApi } from "../../api/endpoint.api";
import {
  ATTRIBUTE_RELATION_FIELDS,
  AttributeListParams,
  AttributeListResponse,
  AttributeRelationFieldList,
  AttributeRelationListResponse,
  AttributeRelationResponse,
  AttributeResponse,
} from "../../interface.type";

const useAttributeFabric =
  <T extends AttributeResponse>(relations?: AttributeRelationFieldList) =>
  ({ attributeId }: { attributeId: string }) => {
    const { data, ...rest } = useQuery({
      queryKey: ["attribute", attributeId, relations],
      queryFn: async () => {
        return attributeApi.get<T>({
          id: attributeId,
          ...relations,
        });
      },

      enabled: !!attributeId,
    });

    return { attributeData: data, ...rest };
  };

export const useAttributeQuery = useAttributeFabric();

export const useAttributeWithValueListQuery =
  useAttributeFabric<AttributeRelationResponse>(ATTRIBUTE_RELATION_FIELDS);

const useAttributeListFabric =
  <T extends AttributeListResponse>(relations?: AttributeRelationFieldList) =>
  (query: AttributeListParams) => {
    const { data, ...rest } = useQuery({
      queryKey: ["attribute", query, relations],
      queryFn: async () => {
        return attributeApi.getList<T>({
          ...query,
          ...relations,
        });
      },
    });

    return { ...data, ...rest };
  };

export const useAttributeListQuery = useAttributeListFabric();
export const useAttributeListWithValueListQuery =
  useAttributeListFabric<AttributeRelationListResponse>(
    ATTRIBUTE_RELATION_FIELDS,
  );
