import {
  defineMiddlewares,
  validateAndTransformQuery,
} from "@medusajs/framework/http";

import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const GetAttributesSchema = createFindParams();

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/attribute",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetAttributesSchema, {
          defaults: [
            "id",
            "name",
            "handle",
            "type",
            "filterable",
            "metadata",
            "created_at",
            "updated_at",
          ],
          isList: true,
        }),
      ],
    },
    {
      // Используем параметр :id для соответствия роуту
      matcher: "/admin/attribute/:id",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetAttributesSchema, {
          defaults: [
            "id",
            "name",
            "handle",
            "type",
            "filterable",
            "metadata",
            "created_at",
            "updated_at",
          ],
          // Важно: для одной записи это false
          isList: false,
        }),
      ],
    },
  ],
});
