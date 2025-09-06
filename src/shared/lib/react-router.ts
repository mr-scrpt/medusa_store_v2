import { useSearchParams } from "react-router-dom";
import { cleanObject } from "./utils";

type QueryParams<T extends string> = {
  [key in T]: string | undefined;
};

export function useQueryParams<T extends string>(
  keys: T[],
  prefix?: string,
): QueryParams<T> {
  const [params] = useSearchParams();

  // Use a type assertion to initialize the result
  const result = {} as QueryParams<T>;

  keys.forEach((key) => {
    const prefixedKey = prefix ? `${prefix}_${key}` : key;
    const value = params.get(prefixedKey) || undefined;

    result[key] = value;
  });

  return result;
}

export const createQueryParams = ({
  query,
  relations,
}: {
  query: Record<string, any>;
  relations?: Record<string, any>;
}) => {
  const combinedParams = {
    ...cleanObject({ ...query, ...relations }),
  };

  return new URLSearchParams(combinedParams);
};

export const createQueryParamsString = ({
  query,
  relations,
}: {
  query: Record<string, any>;
  relations?: Record<string, any>;
}) => createQueryParams({ query, relations }).toString();
