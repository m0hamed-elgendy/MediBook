import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Button from './Button'

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    className = '',
}) => {
    if (totalPages <= 1) return null

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1)
    }

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1)
    }

    const getPageNumbers = () => {
        const pages = []
        const showMax = 5
        let start = Math.max(1, currentPage - Math.floor(showMax / 2))
        let end = Math.min(totalPages, start + showMax - 1)

        if (end - start + 1 < showMax) {
            start = Math.max(1, end - showMax + 1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }
        return pages
    }

    return (
        <div className={`flex items-center justify-between gap-4 py-4 px-1 ${className}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="!p-2"
                    aria-label="Previous page"
                >
                    <FiChevronLeft size={16} />
                </Button>

                {getPageNumbers().map((page) => (
                    <Button
                        key={page}
                        variant={page === currentPage ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className={`min-w-[32px] !p-0 h-8 flex items-center justify-center`}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="!p-2"
                    aria-label="Next page"
                >
                    <FiChevronRight size={16} />
                </Button>
            </div>
        </div>
    )
}

export default Pagination
