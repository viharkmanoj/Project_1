interface ResultTableProps {
  data: Record<string, unknown>[];
}

const ResultTable = ({ data }: ResultTableProps) => {
  if (!data || data.length === 0) {
    return <p className="text-sm text-muted-foreground mt-2">No results found.</p>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="mt-3 overflow-auto rounded-lg border border-border scrollbar-thin max-h-96">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {col.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-surface-hover transition-colors">
              {columns.map((col) => (
                <td key={col} className="whitespace-nowrap px-4 py-2.5 text-foreground">
                  {row[col] != null ? String(row[col]) : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
