import React from 'react'
import { FiAlertOctagon } from 'react-icons/fi'
import Button from './Button'

const ErrorState = ({
    title = 'Something went wrong',
    message = 'We encountered an error while loading the data. Please try again.',
    onRetry,
    retryLabel = 'Try Again',
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center text-center p-8 border border-red-100 dark:border-red-950/30 rounded-xl bg-red-50/20 dark:bg-red-950/5 ${className}`}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 text-red-500 mb-4 animate-bounce">
                <FiAlertOctagon size={24} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
            <p className="text-xs text-red-600 dark:text-red-400 max-w-sm mb-5 leading-normal">{message}</p>
            {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry} className="border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950/30">
                    {retryLabel}
                </Button>
            )}
        </div>
    )
}

export default ErrorState
