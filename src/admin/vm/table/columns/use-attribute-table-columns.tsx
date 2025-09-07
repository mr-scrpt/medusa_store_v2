import { AttributeType } from "@/modules/attribute/interface.type";
import { EllipsisHorizontal } from "@medusajs/icons";
import {
  createDataTableColumnHelper,
  DataTableSortingState,
  DropdownMenu,
  IconButton,
} from "@medusajs/ui";
import { useMemo, useState } from "react";

const PAGE_SIZE = 20;
const columnHelper = createDataTableColumnHelper<AttributeType>();
import { useNavigate } from "react-router-dom";

export const useAttributeTableColumns = () => {
  const navigate = useNavigate();
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        id: "name",
        header: "Name",
        enableSorting: true,
      }),
      columnHelper.accessor("handle", {
        id: "handle",
        header: "Handle",
        enableSorting: true,
      }),
      columnHelper.accessor("created_at", {
        id: "created_at",
        header: "Created At",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton>
                <EllipsisHorizontal />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                onClick={() => navigate(`/attribute/${row.original.id}`)}
              >
                Edit
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        ),
      }),
    ],
    [],
  );

  const defaultSortKey = useMemo(
    () => columns.find((c) => c.enableSorting)?.id || "",
    [columns],
  );

  const [sorting, setSorting] = useState<DataTableSortingState | null>(null);

  const order = useMemo(() => {
    if (sorting) {
      return `${sorting.desc ? "-" : ""}${sorting.id}`;
    }
    return defaultSortKey;
  }, [sorting, defaultSortKey]);

  return {
    columns,
    sorting: {
      state: sorting,
      onSortingChange: setSorting,
    },
    order,
    limit: PAGE_SIZE,
  };
};
// export const useAttributeTableColumns = () => {
//   const navigate = useNavigate();
//
//   const columns = useMemo(
//     () => [
//       columnHelper.accessor("name", {
//         header: "Name",
//       }),
//       columnHelper.accessor("handle", {
//         header: "Handle",
//       }),
//       columnHelper.accessor("type", {
//         header: "Type",
//       }),
//       columnHelper.accessor("filterable", {
//         header: "Filterable",
//         cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
//       }),
//       columnHelper.display({
//         id: "actions",
//         cell: ({ row }) => (
//           <DropdownMenu>
//             <DropdownMenu.Trigger asChild>
//               <IconButton>
//                 <EllipsisHorizontal />
//               </IconButton>
//             </DropdownMenu.Trigger>
//             <DropdownMenu.Content>
//               <DropdownMenu.Item
//                 onClick={() => navigate(`/attributes/${row.original.id}`)}
//               >
//                 Edit
//               </DropdownMenu.Item>
//             </DropdownMenu.Content>
//           </DropdownMenu>
//         ),
//       }),
//     ],
//     [navigate],
//   );
//
//   const sorting = useMemo(
//     () =>
//       ({
//         id: "name",
//         desc: false,
//       } as DataTableSortingState),
//     [],
//   );
//
//   const order = useMemo(
//     () => (sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined),
//     [sorting],
//   );
//
//   const limit = 10;
//
//   return { columns, sorting, order, limit };
// };
