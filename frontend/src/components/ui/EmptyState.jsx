import React from 'react'
import Button from './Button'

const EmptyState = ({
    title = 'No records found',
    description = 'It looks like there is no data to display here yet.',
    icon: Icon,
    actionLabel,
    onAction,
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/30 dark:bg-gray-900/10 ${className}`}>
            {Icon && (
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 mb-4 animate-in fade-in zoom-in-95">
                    <Icon size={24} />
                </div>
            )}
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-5 leading-normal">{description}</p>
            {actionLabel && onAction && (
                <Button variant="outline" size="sm" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}

export default EmptyState
