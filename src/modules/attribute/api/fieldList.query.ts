// src/api/admin/attributes/query-config.ts
export const attributeFieldQuery = [
  "id",
  "name",
  "handle",
  "type",
  "filterable",
  "metadata",
  "created_at",
  "updated_at",
];
export const attributeListFieldQueryConfig = {
  defaults: attributeFieldQuery,
  isList: true,
};
export const attributeFieldQueryConfig = {
  defaults: attributeFieldQuery,
  isList: false,
};
