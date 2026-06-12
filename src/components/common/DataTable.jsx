import React from 'react';

/**
 * Generic Responsive DataTable Component
 * @param {Array} columns - Array of objects: { key, label, render: (val, row) => ReactNode }
 * @param {Array} data - Array of objects
 * @param {boolean} loading - Loading indicator
 * @param {string} emptyMessage - Message shown when no data is available
 */
const DataTable = ({ columns, data = [], loading = false, emptyMessage = 'Data tidak ditemukan.' }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={col.key || idx} className="px-6 py-4 font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg
                      className="h-7 w-7 animate-spin text-teal-600"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-xs text-slate-400 font-medium">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-400 font-medium">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-slate-50/50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={col.key || colIdx} className="px-6 py-4.5 whitespace-nowrap">
                      {col.render
                        ? col.render(row[col.key], row, rowIdx)
                        : row[col.key] !== undefined
                          ? String(row[col.key])
                          : '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
