import React from 'react'
import { FiStar } from 'react-icons/fi'
import Avatar from '../../ui/Avatar'

const LatestReviews = ({ reviews = [], isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="admin-chart-card animate-pulse">
                <h3 className="admin-chart-title mb-4">Latest Reviews</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="admin-chart-card">
            <h3 className="admin-chart-title mb-4">Latest Reviews</h3>
            {reviews.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">No patient reviews submitted yet.</p>
            ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                    {reviews.slice(0, 5).map((rev) => (
                        <div key={rev._id} className="flex gap-3 text-xs bg-gray-50/50 dark:bg-gray-850 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80">
                            <Avatar name={rev.patient?.name} size="sm" />
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-850 dark:text-gray-200">
                                        {rev.patient?.name || 'Anonymous'}
                                    </span>
                                    <div className="flex items-center gap-0.5 text-amber-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <FiStar
                                                key={i}
                                                size={11}
                                                className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400">
                                    reviewed Dr. {rev.doctor?.name || rev.doctor?.user?.name || 'Specialist'}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 italic mt-1 font-medium leading-relaxed">
                                    "{rev.comment || 'No comment provided.'}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LatestReviews
