import React from 'react'

const Badge = ({
    children,
    variant = 'neutral',
    className = '',
    ...props
}) => {
    const baseStyle = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide border'

    const variants = {
        neutral: 'bg-gray-55 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300',
        primary: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300',
        success: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-300',
        warning: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-300',
        danger: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300',
        info: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-300',
        pending: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-300',
        confirmed: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300',
        completed: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-300',
        cancelled: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300',
    }

    return (
        <span
            className={`${baseStyle} ${variants[variant] || variants.neutral} ${className}`}
            {...props}
        >
            {children}
        </span>
    )
}

export default Badge
