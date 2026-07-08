import { useState, useEffect, useCallback } from 'react'
import reviewService from '../../services/review.service'
import Avatar from '../../components/ui/Avatar'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import Skeleton from '../../components/ui/Skeleton'
import { Star, MessageSquare } from 'lucide-react'

const Reviews = () => {
    const [reviews, setReviews] = useState([])
    const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0 })
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError('')
            const [reviewsRes, summaryRes] = await Promise.all([
                reviewService.getDoctorOwnReviews({ page: currentPage, limit: 10 }),
                reviewService.getDoctorOwnSummary()
            ])
            setReviews(reviewsRes.data || [])
            setTotalPages(reviewsRes.totalPages || 1)
            setSummary(summaryRes || { averageRating: 0, totalReviews: 0 })
        } catch (err) {
            console.error(err)
            setError('Failed to fetch rating feedback.')
        } finally {
            setLoading(false)
        }
    }, [currentPage])

    useEffect(() => {
        let active = true
        const load = async () => {
            if (!active) return
            await fetchData()
        }
        load()
        return () => { active = false }
    }, [fetchData])

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Reviews & Ratings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    See what patients are saying about their clinical consultations.
                </p>
            </div>

            {error ? (
                <ErrorState message={error} onRetry={fetchData} />
            ) : loading ? (
                <div className="space-y-4">
                    <Skeleton variant="rectangular" height={100} />
                    <Skeleton variant="rectangular" height={200} />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl gap-4">
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Rating</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                                    {summary.averageRating ? summary.averageRating.toFixed(1) : '0.0'}
                                </span>
                                <span className="text-sm text-gray-400">/ 5.0</span>
                            </div>
                        </div>

                        {/* Stars */}
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < Math.round(summary.averageRating || 0)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-gray-200 dark:text-gray-800'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 mt-2">Based on {summary.totalReviews || 0} reviews</span>
                        </div>
                    </div>

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                        <EmptyState
                            title="No patient feedback yet"
                            description="Feedback comments will appear here once consultations are completed and patients review them."
                            icon={MessageSquare}
                        />
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl divide-y divide-gray-100 dark:divide-gray-800">
                                {reviews.map((rev) => (
                                    <div key={rev._id} className="p-5 flex gap-4 items-start">
                                        <Avatar name={rev.patient?.name} size="sm" />
                                        <div className="flex-1 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {rev.patient?.name || 'Patient'}
                                                </h4>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            {/* Stars */}
                                            <div className="flex items-center gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3.5 h-3.5 ${
                                                            i < rev.rating
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'text-gray-200 dark:text-gray-800'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                                                "{rev.comment}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Reviews
