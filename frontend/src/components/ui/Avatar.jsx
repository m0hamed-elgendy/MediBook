import React from 'react'

const Avatar = ({
    src,
    alt = '',
    name = '',
    size = 'md',
    className = '',
    fallbackBg = 'bg-gradient-to-br from-blue-500 to-indigo-600',
    ...props
}) => {
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U'

    const sizes = {
        xs: 'w-6 h-6 text-[10px]',
        sm: 'w-8 h-8 text-[12px] font-semibold',
        md: 'w-10 h-10 text-[14px] font-bold',
        lg: 'w-12 h-12 text-[16px] font-bold',
        xl: 'w-16 h-16 text-[20px] font-bold',
        '2xl': 'w-24 h-24 text-[28px] font-bold',
    }

    return (
        <div
            className={`
                relative flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-800
                ${src ? 'bg-white' : `${fallbackBg} text-white`}
                ${sizes[size]}
                ${className}
            `}
            {...props}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt || name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                    }}
                />
            ) : null}
            <span className={src ? 'hidden' : 'flex'}>{initials}</span>
        </div>
    )
}

export default Avatar
