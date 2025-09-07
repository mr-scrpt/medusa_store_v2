// import { defineRouteConfig } from "@medusajs/admin-sdk";
// import { ChatBubbleLeftRight } from "@medusajs/icons";
// import {
//   Container,
//   Heading,
//   DataTable,
//   useDataTable,
//   createDataTableColumnHelper,
//   createDataTableFilterHelper,
//   DataTablePaginationState,
// } from "@medusajs/ui";
// import { useQuery } from "@tanstack/react-query";
// import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { HttpTypes } from "@medusajs/framework/types";
// import { sdk } from "../../lib/config";
//
// const columnHelper = createDataTableColumnHelper<HttpTypes.AdminProduct>();
// const columns = [
//   columnHelper.accessor("title", {
//     header: "Title",
//     enableSorting: true,
//     sortLabel: "Title",
//     sortAscLabel: "A-Z",
//     sortDescLabel: "Z-A",
//   }),
//   columnHelper.accessor("status", {
//     header: "Status",
//     cell: ({ getValue }) => {
//       const status = getValue();
//       return (
//         <span style={{ color: status === "published" ? "green" : "grey" }}>
//           {status === "published" ? "Published" : "Draft"}
//         </span>
//       );
//     },
//   }),
// ];
//
// const filterHelper = createDataTableFilterHelper<HttpTypes.AdminProduct>();
// const filters = [
//   filterHelper.accessor("status", {
//     type: "select",
//     label: "Status",
//     options: [
//       { label: "Published", value: "published" },
//       { label: "Draft", value: "draft" },
//     ],
//   }),
// ];
//
// const limit = 15;
//
// const MyCustomPage = () => {
//   const [pagination, setPagination] = useState<DataTablePaginationState>({
//     pageSize: limit,
//     pageIndex: 0,
//   });
//   const [search, setSearch] = useState<string>("");
//   const [filtering, setFiltering] = useState({});
//   const [sorting, setSorting] = useState(null);
//
//   const offset = useMemo(() => pagination.pageIndex * limit, [pagination]);
//   const statusFilters = useMemo(() => filtering.status || [], [filtering]);
//
//   const { data, isLoading } = useQuery({
//     queryFn: () =>
//       sdk.admin.product.list({
//         limit,
//         offset,
//         q: search,
//         status: statusFilters,
//         order: sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined,
//       }),
//     queryKey: [
//       [
//         "products",
//         limit,
//         offset,
//         search,
//         statusFilters,
//         sorting?.id,
//         sorting?.desc,
//       ],
//     ],
//   });
//
//   const navigate = useNavigate();
//   const table = useDataTable({
//     columns,
//     data: data?.products || [],
//     getRowId: (row) => row.id,
//     rowCount: data?.count || 0,
//     isLoading,
//     pagination: {
//       state: pagination,
//       onPaginationChange: setPagination,
//     },
//     search: {
//       state: search,
//       onSearchChange: setSearch,
//     },
//     filtering: {
//       state: filtering,
//       onFilteringChange: setFiltering,
//     },
//     filters,
//     sorting: {
//       state: sorting,
//       onSortingChange: setSorting,
//     },
//     onRowClick: (event, row) => {
//       navigate(`/products/${row.id}`);
//     },
//   });
//
//   return (
//     <Container>
//       <DataTable instance={table}>
//         <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
//           <Heading>Products</Heading>
//           <div className="flex gap-2">
//             <DataTable.FilterMenu tooltip="Filter" />
//             <DataTable.SortingMenu tooltip="Sort" />
//             <DataTable.Search placeholder="Search..." />
//           </div>
//         </DataTable.Toolbar>
//         <DataTable.Table />
//         <DataTable.Pagination />
//       </DataTable>
//     </Container>
//   );
// };
//
// export const config = defineRouteConfig({
//   label: "Attributes",
//   icon: ChatBubbleLeftRight,
// });
//
// export default MyCustomPage;
//
