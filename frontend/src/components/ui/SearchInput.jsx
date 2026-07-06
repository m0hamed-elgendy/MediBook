import React, { useRef } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

const SearchInput = ({
    value = '',
    onChange,
    placeholder = 'Search...',
    className = '',
    onClear,
    showShortcut = false,
    ...props
}) => {
    const inputRef = useRef(null)

    const handleClear = () => {
        if (onClear) onClear()
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    return (
        <div className={`relative flex items-center w-full ${className}`}>
            <span className="absolute left-3.5 text-gray-400 pointer-events-none dark:text-gray-500">
                <FiSearch size={16} />
            </span>
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-950/30"
                {...props}
            />
            {value ? (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                    <FiX size={14} />
                </button>
            ) : showShortcut ? (
                <div className="absolute right-3 flex items-center gap-0.5 pointer-events-none">
                    <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[10px] text-gray-400 font-semibold font-sans">
                        ⌘
                    </kbd>
                    <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[10px] text-gray-400 font-semibold font-sans">
                        K
                    </kbd>
                </div>
            ) : null}
        </div>
    )
}

export default SearchInput
