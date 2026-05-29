export function Table({ headers, rows, renderRow, rowKey = 'id' }) {
  return (
    <div className="w-full border border-[#E8DDD0] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FAF7F2]">
            {headers.map((h) => (
              <th
                key={h}
                className="text-xs font-semibold text-[#7A6555] uppercase tracking-wide px-4 py-3 text-left"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-8 text-center text-sm text-[#7A6555]"
              >
                Sin registros
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row[rowKey]}
                className="border-t border-[#E8DDD0] hover:bg-[#FAF7F2] transition-colors"
              >
                {renderRow(row)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
