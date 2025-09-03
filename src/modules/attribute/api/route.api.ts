const BASE_ENDPOINT = "/admin/attribute";
export const API_ATTRIBUTE_ENDPOINT = {
  BASE: BASE_ENDPOINT,

  QUERY: {
    GET_LIST: "/admin/attribute",
    GET_BY_ID: (id: string) => `${BASE_ENDPOINT}/${id}`,
  },
  MUTATION: {
    CREATE: "/admin/attribute",
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
