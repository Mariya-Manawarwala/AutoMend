export default function Table({ headers = [], rows = [], className = "" }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-amber-600/20">
            {headers.map((h, i) => (
              <th
                key={i}
                className={`text-left py-3 px-4 text-amber-100 font-semibold text-sm ${h.hideOnMobile ? "hidden md:table-cell" : ""}`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`py-3 px-4 text-sm ${headers[ci]?.hideOnMobile ? "hidden md:table-cell" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="text-center py-8 text-gray-500">No data available.</div>
      )}
    </div>
  );
}
