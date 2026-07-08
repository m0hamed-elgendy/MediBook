import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const Select = ({
    value,
    onChange,
    options = [],
    placeholder = 'Select...',
    label,
    error,
    helperText,
    disabled = false,
    required = false,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const containerRef = useRef(null)
    const triggerRef = useRef(null)

    const highlightedRef = useRef(highlightedIndex)
    const isOpenRef = useRef(isOpen)
    const onChangeRef = useRef(onChange)
    const optionsRef = useRef(options)

    useEffect(() => { highlightedRef.current = highlightedIndex }, [highlightedIndex])
    useEffect(() => { isOpenRef.current = isOpen }, [isOpen])
    useEffect(() => { onChangeRef.current = onChange }, [onChange])
    useEffect(() => { optionsRef.current = options }, [options])

    const selectedOption = options.find(o => o.value === value)

    useEffect(() => {
        if (!isOpen) return
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        const handleKeyDown = (e) => {
            const opts = optionsRef.current
            if (opts.length === 0) return

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault()
                    setHighlightedIndex(prev => {
                        const next = prev < opts.length - 1 ? prev + 1 : 0
                        highlightedRef.current = next
                        return next
                    })
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    setHighlightedIndex(prev => {
                        const next = prev > 0 ? prev - 1 : opts.length - 1
                        highlightedRef.current = next
                        return next
                    })
                    break
                case 'Enter': {
                    e.preventDefault()
                    const idx = highlightedRef.current
                    if (idx >= 0 && idx < opts.length) {
                        onChangeRef.current(opts[idx].value)
                        setIsOpen(false)
                        triggerRef.current?.focus()
                    }
                    break
                }
                case 'Escape':
                    e.preventDefault()
                    setIsOpen(false)
                    triggerRef.current?.focus()
                    break
                case 'Tab':
                    setIsOpen(false)
                    break
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

    const toggleOpen = () => {
        if (disabled) return
        setIsOpen(prev => !prev)
        if (!isOpen) {
            const idx = options.findIndex(o => o.value === value)
            setHighlightedIndex(idx >= 0 ? idx : 0)
        }
    }

    return (
        <div ref={containerRef} className="flex flex-col w-full gap-1.5">
            {label && (
                <label className="text-sm font-medium text-gray-700" onClick={() => triggerRef.current?.focus()}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <button
                    ref={triggerRef}
                    type="button"
                    disabled={disabled}
                    onClick={toggleOpen}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowDown' || (e.key === 'Enter' && !isOpen) || (e.key === ' ' && !isOpen)) {
                            e.preventDefault()
                            if (!isOpen) toggleOpen()
                        }
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-label={label || placeholder}
                    className={`
                        w-full h-11 px-4 text-sm rounded-xl border bg-white text-gray-900 shadow-sm
                        transition-all duration-200 flex items-center justify-between gap-2
                        ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:border-gray-300 cursor-pointer'}
                        ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}
                        ${error ? 'border-red-500 ring-2 ring-red-100' : ''}
                        ${className}
                    `}
                >
                    <span className={`truncate ${!selectedOption ? 'text-gray-400' : ''}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400 shrink-0"
                    >
                        <ChevronDown size={18} />
                    </motion.span>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.97 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute z-50 w-full mt-1.5 bg-white rounded-xl border border-gray-200 shadow-lg py-1 max-h-60 overflow-y-auto"
                            role="listbox"
                        >
                            {options.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-400 text-center">No options available</div>
                            ) : (
                                options.map((opt, index) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        role="option"
                                        aria-selected={value === opt.value}
                                        disabled={opt.disabled}
                                        onClick={() => {
                                            onChange(opt.value)
                                            setIsOpen(false)
                                            triggerRef.current?.focus()
                                        }}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                        className={`
                                            w-full px-4 py-2.5 text-sm text-left transition-colors duration-150
                                            ${value === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                                            ${highlightedIndex === index && value !== opt.value ? 'bg-gray-50' : ''}
                                            ${opt.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                    >
                                        {opt.label}
                                    </button>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error ? (
                <p className="text-xs font-medium text-red-500">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-gray-400">{helperText}</p>
            ) : null}
        </div>
    )
}

export default Select
