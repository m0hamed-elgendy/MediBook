import React, { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnOverlayClick = true,
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', handleEscape)
        }
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl',
    }

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={closeOnOverlayClick ? onClose : undefined}
            />

            {/* Modal Box */}
            <div
                className={`
                    relative w-full ${sizes[size]} bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-150 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden
                    animate-in fade-in zoom-in-95 duration-200
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-all duration-200"
                        aria-label="Close modal"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto flex-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Modal
