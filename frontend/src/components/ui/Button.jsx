import { motion } from 'framer-motion'

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
    const baseStyle = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
    
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm border border-transparent cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-transparent cursor-pointer disabled:bg-gray-50 disabled:text-gray-400',
        outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer disabled:border-gray-200 disabled:text-gray-400',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm border border-transparent cursor-pointer disabled:bg-gray-100 disabled:text-gray-400',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-50 cursor-pointer disabled:text-gray-400',
    }

    const sizes = {
        sm: 'h-9 px-3.5 text-xs',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
    }

    return (
        <motion.button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            whileHover={!disabled ? { scale: 1.02 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
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
        </motion.button>
    )
}

export default Button
