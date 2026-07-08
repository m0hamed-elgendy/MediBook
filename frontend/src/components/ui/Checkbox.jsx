import React from 'react'
import { Check } from 'lucide-react'

const Checkbox = ({
    label,
    description,
    checked = false,
    onChange,
    disabled = false,
    error,
    id,
}) => {
    const inputId = id || `checkbox-${Math.random().toString(36).slice(2)}`

    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={inputId}
                className={`flex items-start gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}`}
            >
                <div className="relative mt-0.5 shrink-0">
                    <input
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                        className="sr-only"
                    />
                    <div
                        className={`
                            w-5 h-5 rounded-md border-2 flex items-center justify-center
                            transition-all duration-150
                            ${checked
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300 bg-white group-hover:border-gray-400'
                            }
                        `}
                    >
                        {checked && <Check size={13} className="text-white" strokeWidth={3} />}
                    </div>
                </div>
                <div className="flex flex-col gap-0.5">
                    {label && (
                        <span className="text-sm font-medium text-gray-900">{label}</span>
                    )}
                    {description && (
                        <span className="text-xs text-gray-400">{description}</span>
                    )}
                </div>
            </label>
            {error && (
                <p className="text-xs font-medium text-red-500 ml-8">{error}</p>
            )}
        </div>
    )
}

export default Checkbox
