import React from 'react'

const Radio = ({
    label,
    description,
    checked = false,
    onChange,
    value,
    name,
    disabled = false,
}) => {
    const inputId = `radio-${name}-${value}`

    return (
        <label
            htmlFor={inputId}
            className={`flex items-start gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}`}
        >
            <div className="relative mt-0.5 shrink-0">
                <input
                    id={inputId}
                    type="radio"
                    checked={checked}
                    onChange={() => onChange(value)}
                    value={value}
                    name={name}
                    disabled={disabled}
                    className="sr-only"
                />
                <div
                    className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        transition-all duration-150
                        ${checked
                            ? 'border-blue-600'
                            : 'border-gray-300 bg-white group-hover:border-gray-400'
                        }
                    `}
                >
                    {checked && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}
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
    )
}

export default Radio
