import React from 'react'
import Select from './Select'

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
                <div key={filter.key} className="min-w-[160px]">
                    <Select
                        value={activeFilters[filter.key] || 'all'}
                        onChange={(val) => handleSelectChange(filter.key, val)}
                        options={[
                            { value: 'all', label: filter.allLabel || `All ${filter.label || ''}` },
                            ...filter.options,
                        ]}
                        label={filter.label}
                    />
                </div>
            ))}
            
            {hasActiveFilters && onReset && (
                <button
                    onClick={onReset}
                    className="self-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1.5 mt-6"
                >
                    Reset Filters
                </button>
            )}
        </div>
    )
}

export default Filters
