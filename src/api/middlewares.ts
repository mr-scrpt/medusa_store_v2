import {
  attributeFieldQueryConfig,
  attributeListFieldQueryConfig,
} from "@/modules/attribute/api/fieldList.query";
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
          ...attributeListFieldQueryConfig,
        }),
      ],
    },
    {
      matcher: "/admin/attribute/:id",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetAttributesSchema, {
          ...attributeFieldQueryConfig,
        }),
      ],
    },
  ],
});
