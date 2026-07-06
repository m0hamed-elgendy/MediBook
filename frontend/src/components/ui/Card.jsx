import { motion } from 'framer-motion'

const Card = ({ children, className = '', hoverable = false }) => {
    return (
        <motion.div
            whileHover={hoverable ? { y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`
                bg-white dark:bg-gray-900
                rounded-2xl
                border border-gray-100 dark:border-gray-800
                shadow-sm
                ${className}
            `}
        >
            {children}
        </motion.div>
    )
}

export default Card