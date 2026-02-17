import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../../style/PagesStyles/titulo_TablasStyle.css";

type tableVariable = "list" | "summary";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
}


interface TableBaseProps<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  rowsSkeleton?: number;
  showCheckbox?: boolean;
  selectedRows?: number[];
  onSelectRow?: (row: T) => void;
  onSelectAll?:(checked: boolean) => void;
  allSelected?: boolean;
  getRowId?: (row: T) => number;
  variant?: tableVariable;
}

export function TableBase<T>({
  columns,
  data,
  loading,
  rowsSkeleton = 2,
  showCheckbox = false,
  selectedRows = [],
  onSelectAll,
  onSelectRow,
  allSelected,
  getRowId,
  variant = "list"
}: TableBaseProps<T>) {
  return (
    <div className="table-responsive details-table table table-hover table-sm align-middle w-100">
      <table className="details-table table table-hover table-sm align-middle w-100">
        <thead className="facturas-thead">
          <tr>
            {showCheckbox && variant === "list" && <th>
              <input type="checkbox" aria-label="Seleccionar todas las filas" checked={allSelected} onChange={(e) => onSelectAll?.(e.target.checked)}/>
              </th>}
            {columns.map((col) => (
              <th key={String(col.accessor)}>{col.header}</th>
            ))}
          </tr>
        </thead>
        

        <tbody>
          {loading ? Array.from({ length: rowsSkeleton }).map((_, i) => (
                <tr key={i}>
                  {Array.from({length: columns.length + (showCheckbox ? 1 : 0),}).map((__, j) => (
                    <td key={j}>
                      <Skeleton height={20} />
                    </td>
                  ))}
                </tr>
              )): data.map((row, i) => {
                const id = getRowId?.(row);
                return (
                  <tr key={i} className="table-hovers">
                    {showCheckbox && (
                      <td>
                        <input
                          type="checkbox" checked={id ? selectedRows.includes(id) : false} onChange={() => onSelectRow?.(row)}/>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={String(col.accessor)} style={{textAlign: "center"}}>
                        {col.render  ? col.render(row) : String(row[col.accessor])}
                      </td>
                    ))}
                  </tr>
                );
              })}

          {!loading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (showCheckbox ? 1 : 0)}
                style={{ textAlign: "center" }}>
                NO HAY DATOS QUE MOSTRAR
              </td>
            </tr>
          )}
        </tbody>
        
      </table>
      
    </div>
  );
}
