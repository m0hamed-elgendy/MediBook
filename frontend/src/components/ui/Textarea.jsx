import React from 'react'

const Textarea = React.forwardRef(({
    label,
    error,
    helperText,
    className = '',
    disabled = false,
    required = false,
    rows = 4,
    ...props
}, ref) => {
    return (
        <div className="flex flex-col w-full gap-1.5">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <textarea
                ref={ref}
                disabled={disabled}
                required={required}
                rows={rows}
                className={`
                    w-full px-4 py-3 text-sm rounded-xl border bg-white text-gray-900 shadow-sm
                    transition-all duration-200 resize-none
                    placeholder:text-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                    ${error ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200 hover:border-gray-300'}
                    ${className}
                `}
                {...props}
            />
            {error ? (
                <p className="text-xs font-medium text-red-500">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-gray-400">{helperText}</p>
            ) : null}
        </div>
    )
})

Textarea.displayName = 'Textarea'

export default Textarea
