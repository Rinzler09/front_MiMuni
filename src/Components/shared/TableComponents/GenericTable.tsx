// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import "../../../style/PagesStyles/titulo_TablasStyle.css";

// type tableVariable = "list" | "summary";

// interface Column<T> {
//     header: string;
//     accesor: keyof T;
//     render?: (row: T) => React.ReactNode;
// }

// interface GenericTableProps<T> {
//     columns: Column<T>[];
//     data: T[];
//     loading: boolean;
//     rowsSkeleton?: number;
//     showCheckbox?: boolean;
//     selectedRows?: number[];
//     onSelectRow?: (row: T) => void;
//     onSelectAll?: (checked: boolean) => void;
//     allSelected?: boolean;
//     getRowId?: (row: T) => number;
//     variant?: tableVariable;
// }

// export function GenericTable<T>({
//     columns,
//     data,
//     loading,
//     rowsSkeleton,
//     showCheckbox,
//     selectedRows,
//     onSelectAll,
//     onSelectRow,
//     allSelected,
//     getRowId,
//     variant,
// }: GenericTableProps<T>) {
//     return (
//         <div className="table-responsive details-table table table-hover table-sm align-middle w-100">
//             <table className="details-table table table-hover table-sm align-middle w-100">
//                 <thead className="facturas-thead">
//                     <tr>
//                         {showCheckbox && variant === "list" &&
//                             <th>
//                                 <input type="checkbox" aria-label="Seleccionar todas las filas" checked={allSelected} onChange={(e) => onSelectAll?.(e.target.checked)} />
//                             </th>
//                         }
//                         {
//                             columns.map((col) => (
//                                 <th key={String(col.accesor)}>{col.header}</th>
//                             ))}
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {loading ? Array
//                     }
//                 </tbody>
//             </table>
//         </div>
//     )
// }