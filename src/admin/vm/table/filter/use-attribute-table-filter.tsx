import { AttributeType } from "@/modules/attribute/interface.type";
import { createDataTableFilterHelper } from "@medusajs/ui";
import { useMemo } from "react";

const filterHelper = createDataTableFilterHelper<AttributeType>();

export const useAttributeTableFilters = () => {
  const filters = useMemo(
    () => [
      filterHelper.accessor("name", {
        type: "select",
        label: "Search",
        options: [{ label: "Attribute name", value: "name" }],
      }),
      filterHelper.accessor("created_at", {
        type: "select",
        label: "Created At",
        options: [{ label: "Created At", value: "created_at" }],
      }),
    ],
    [],
  );

  return filters;
};
