import React from 'react'

const Filters = ({
    filters = [],
    activeFilters = {},
    onFilterChange,
    onReset,
    className = '',
}) => {
    const handleSelectChange = (key, val) => {
        onFilterChange(key, val === 'all' ? '' : val)
    }

    const hasActiveFilters = Object.values(activeFilters).some(val => val !== undefined && val !== '')

    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            {filters.map((filter) => (
                <div key={filter.key} className="flex flex-col gap-1">
                    {filter.label && (
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            {filter.label}
                        </span>
                    )}
                    <select
                        value={activeFilters[filter.key] || 'all'}
                        onChange={(e) => handleSelectChange(filter.key, e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
                    >
                        <option value="all">{filter.allLabel || `All ${filter.label || ''}`}</option>
                        {filter.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
            
            {hasActiveFilters && onReset && (
                <button
                    onClick={onReset}
                    className="self-end text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors py-1.5"
                >
                    Reset Filters
                </button>
            )}
        </div>
    )
}

export default Filters
