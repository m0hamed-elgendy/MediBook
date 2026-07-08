import { forwardRef } from 'react'

const Input = forwardRef(({
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
                <label className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                disabled={disabled}
                required={required}
                className={`
                    w-full h-11 px-4 text-sm rounded-xl border bg-white text-gray-900 shadow-sm
                    transition-all duration-200 cursor-text
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

Input.displayName = 'Input'

export default Input
