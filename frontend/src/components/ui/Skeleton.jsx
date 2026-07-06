import React from 'react'

const Skeleton = ({
    variant = 'text',
    width,
    height,
    className = '',
    ...props
}) => {
    const baseStyle = 'bg-gray-100 dark:bg-gray-800 animate-pulse'

    const variants = {
        text: 'rounded h-4 w-full',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
    }

    return (
        <div
            className={`${baseStyle} ${variants[variant]} ${className}`}
            style={{ width, height }}
            {...props}
        />
    )
}

export default Skeleton
