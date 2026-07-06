import React from 'react'

const Table = ({
    columns,
    data = [],
    isLoading = false,
    emptyMessage = 'No records found.',
    className = '',
    onRowClick,
}) => {
    return (
        <div className={`w-full overflow-x-auto rounded-xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900 ${className}`}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-150 dark:border-gray-800 bg-gray-50/75 dark:bg-gray-850/50">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, rIdx) => (
                            <tr key={rIdx} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                {columns.map((col, cIdx) => (
                                    <td key={cIdx} className="px-4 py-3.5">
                                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rIdx) => (
                            <tr
                                key={row.id || row._id || rIdx}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                                className={`
                                    border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-all duration-150
                                    ${onRowClick ? 'cursor-pointer' : ''}
                                `}
                            >
                                {columns.map((col, cIdx) => (
                                    <td key={cIdx} className={`px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300 ${col.className || ''}`}>
                                        {col.cell ? col.cell(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Table
