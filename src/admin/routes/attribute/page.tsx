import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";

import {
  Button,
  Container,
  DataTable,
  Heading,
  useDataTable,
} from "@medusajs/ui";

import { useAttributeListWithValueListQuery } from "@/modules/attribute/interface.client";

import { useNavigate } from "react-router-dom";
import { useAttributeTableColumns } from "../../vm/table/columns/use-attribute-table-columns";

const AttributesPage = () => {
  const navigate = useNavigate();
  const { columns, order, sorting, limit } = useAttributeTableColumns();
  const { data, count, isLoading } = useAttributeListWithValueListQuery({
    order,
    limit,
  });

  const table = useDataTable({
    data: attributeList.map((attribute) => attribute.attributeData) || [],
    columns,
    getRowId: (row) => row.id,
    rowCount: count,
    isLoading,
    sorting,
  });

  return (
    <Container>
      <DataTable instance={table}>
        <DataTable.Toolbar>
          <Heading>Attributes</Heading>
          <div className="flex items-center gap-x-2 ml-auto">
            <Button
              variant="secondary"
              onClick={() => navigate("/attribute/create")}
            >
              Create Attribute
            </Button>
          </div>
        </DataTable.Toolbar>
        <DataTable.Table />
      </DataTable>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Attributes",
  icon: ChatBubbleLeftRight,
});

export default AttributesPage;
