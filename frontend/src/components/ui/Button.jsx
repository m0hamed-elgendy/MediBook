import React from 'react'

const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    className = '',
    onClick,
    icon: Icon,
    ...props
}) => {
    const baseStyle = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-transparent focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-transparent focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
        outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-850',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm border border-transparent focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
    }

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : Icon ? (
                <Icon className="-ml-0.5 mr-2 h-4 w-4" />
            ) : null}
            {children}
        </button>
    )
}

export default Button
