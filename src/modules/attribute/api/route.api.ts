//  src/modules/attribute/api/route.api.ts
const BASE_ENDPOINT = "/admin/attribute";

export const API_ATTRIBUTE_ENDPOINT = {
  BASE: BASE_ENDPOINT,

  QUERY: {
    GET_LIST: BASE_ENDPOINT,
    GET_BY_ID: (id: string) => `${BASE_ENDPOINT}/${id}`,
  },
  MUTATION: {
    CREATE: BASE_ENDPOINT,
    UPDATE: (id: string) => `${BASE_ENDPOINT}/${id}`,
    DELETE: (id: string) => `${BASE_ENDPOINT}/${id}`,
  },
} as const;

const BASE_ROUTE = "/attribute";

export const PAGE_ATTRIBUTE_ROUTES = {
  BASE: BASE_ROUTE,
  CREATE: `${BASE_ROUTE}/create`,
  EDIT: `${BASE_ROUTE}/:id/update`,
} as const;
