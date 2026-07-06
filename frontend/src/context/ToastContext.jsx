import React, { createContext, useContext, useState, useCallback } from 'react'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts(prev => [...prev, { id, message, type }])

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, duration)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const icons = {
        success: <FiCheckCircle className="text-emerald-500 w-5 h-5" />,
        error: <FiAlertCircle className="text-rose-500 w-5 h-5" />,
        info: <FiInfo className="text-blue-500 w-5 h-5" />,
    }

    const borderColors = {
        success: 'border-emerald-100 dark:border-emerald-950/30',
        error: 'border-rose-100 dark:border-rose-950/30',
        info: 'border-blue-100 dark:border-blue-950/30',
    }

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Floating Toasts container */}
            <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 max-w-sm w-full">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            flex items-start gap-3 p-4 bg-white dark:bg-gray-900 border rounded-xl shadow-lg
                            animate-in slide-in-from-bottom-5 fade-in duration-300
                            ${borderColors[toast.type]}
                        `}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {icons[toast.type]}
                        </div>
                        <div className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-250">
                            {toast.message}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
