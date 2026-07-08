import React from 'react'

const FormField = ({
    label,
    error,
    helperText,
    required = false,
    children,
    className = '',
}) => {
    return (
        <div className={`flex flex-col w-full gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            {children}
            {error ? (
                <p className="text-xs font-medium text-red-500">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-gray-400">{helperText}</p>
            ) : null}
        </div>
    )
}

export default FormField
