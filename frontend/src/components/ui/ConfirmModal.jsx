import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'

const variants = {
  danger: {
    icon: FiAlertTriangle,
    containerStyle: 'bg-amber-50 border-amber-100',
    iconStyle: 'text-amber-600',
    buttonStyle: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
  },
  primary: {
    icon: FiCheckCircle,
    containerStyle: 'bg-blue-50 border-blue-100',
    iconStyle: 'text-blue-600',
    buttonStyle: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
  },
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  detail,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  isLoading = false,
  confirmDisabled = false,
  children,
}) => {
  const confirmRef = useRef(null)
  const v = variants[confirmVariant]
  const Icon = v.icon

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    confirmRef.current?.focus()
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'Enter' && !isLoading && !confirmDisabled) {
        const tag = document.activeElement?.tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          onConfirm()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onConfirm, isLoading, confirmDisabled])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
            role="dialog"
            aria-modal="true"
          >
            <div className={`flex items-center justify-center w-11 h-11 rounded-full border ${v.containerStyle} mb-4`}>
              <Icon className={`w-5 h-5 ${v.iconStyle}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{title}</h3>
            {message && (
              <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
            )}
            {detail && (
              <p className="text-xs text-gray-500 leading-relaxed mt-1.5">{detail}</p>
            )}
            {children && <div className="mt-4">{children}</div>}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={onConfirm}
                disabled={isLoading || confirmDisabled}
                className={`px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center gap-2 ${v.buttonStyle}`}
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal
