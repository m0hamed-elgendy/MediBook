import React from 'react'
import { motion } from 'framer-motion'

const Switch = ({
    label,
    description,
    checked = false,
    onChange,
    disabled = false,
    id,
}) => {
    const inputId = id || `switch-${Math.random().toString(36).slice(2)}`

    const handleClick = () => {
        if (!disabled) {
            onChange(!checked)
        }
    }

    return (
        <label
            htmlFor={inputId}
            className={`flex items-start gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <div className="relative mt-0.5 shrink-0">
                <input
                    id={inputId}
                    type="checkbox"
                    role="switch"
                    checked={checked}
                    onChange={handleClick}
                    disabled={disabled}
                    className="sr-only"
                />
                <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    disabled={disabled}
                    onClick={handleClick}
                    className={`
                        relative inline-flex h-6 w-11 items-center rounded-full
                        transition-colors duration-200
                        ${checked ? 'bg-blue-600' : 'bg-gray-200'}
                        ${!disabled ? 'group-hover:bg-gray-300' : ''}
                        focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2
                    `}
                >
                    <motion.span
                        animate={{ x: checked ? 22 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                    />
                </button>
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

export default Switch
