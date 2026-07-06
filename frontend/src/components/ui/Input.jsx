import React from 'react'

const Input = React.forwardRef(({
    type = 'text',
    label,
    error,
    helperText,
    className = '',
    disabled = false,
    required = false,
    ...props
}, ref) => {
    return (
        <div className="flex flex-col w-full gap-1.5">
            {label && (
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                disabled={disabled}
                required={required}
                className={`
                    w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm transition-all duration-200
                    placeholder:text-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                    dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-600
                    dark:focus:border-blue-500 dark:focus:ring-blue-950/30
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:border-red-500' : ''}
                    ${className}
                `}
                {...props}
            />
            {error ? (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
            ) : null}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
