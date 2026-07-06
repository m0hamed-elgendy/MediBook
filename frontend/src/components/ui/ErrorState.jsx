import React from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import Button from './Button'

const ErrorState = ({
  title = 'Failed to load',
  message = 'Something went wrong while loading this section.',
  onRetry,
  retryLabel = 'Retry',
  className = '',
  compact = false,
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        bg-white border border-gray-200 rounded-xl
        ${compact ? 'p-6' : 'p-8'}
        ${className}
      `}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500 mb-3">
        <FiAlertCircle size={20} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 max-w-sm mb-4 leading-normal">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

export default ErrorState
