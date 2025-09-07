import { useQueryParams } from "@/shared/lib/react-router";

export const useAttributeTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number;
  prefix?: string;
}) => {
  const queryObject = useQueryParams(
    [
      "q",
      "order",
      "status",
      "created_at",
      "updated_at",
      "offset",
      "order",
      "id",
    ],
    prefix,
  );

  const searchParams = {
    limit: pageSize,
    offset: queryObject.offset ? Number(queryObject.offset) : 0,
    order: queryObject.order,
    q: queryObject.q,
    status: queryObject.status,
    created_at: queryObject.created_at
      ? JSON.parse(queryObject.created_at)
      : undefined,
    updated_at: queryObject.updated_at
      ? JSON.parse(queryObject.updated_at)
      : undefined,
  };

  return {
    raw: queryObject,
    searchParams,
  };
};
