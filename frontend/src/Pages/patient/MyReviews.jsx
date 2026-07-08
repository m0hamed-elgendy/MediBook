import { useState, useEffect, useCallback } from 'react'
import reviewService from '../../services/review.service'
import { useToast } from '../../context/ToastContext'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import Skeleton from '../../components/ui/Skeleton'
import Textarea from '../../components/ui/Textarea'
import Pagination from '../../components/ui/Pagination'
import { FiStar, FiMessageSquare, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi'

const MyReviews = () => {
    const { addToast } = useToast()
    const [reviews, setReviews] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Edit Review Modal
    const [reviewToEdit, setReviewToEdit] = useState(null)
    const [editRating, setEditRating] = useState(5)
    const [editComment, setEditComment] = useState('')
    const [isSavingEdit, setIsSavingEdit] = useState(false)

    // Delete Review Confirm Modal
    const [reviewToDelete, setReviewToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true)
            setError('')
            const res = await reviewService.getMyReviews({
                page: currentPage,
                limit: 5
            })
            setReviews(res.data || [])
            setTotal(res.total || 0)
            setTotalPages(res.totalPages || 1)
        } catch (err) {
            console.error(err)
            setError('Failed to fetch your reviews list.')
        } finally {
            setLoading(false)
        }
    }, [currentPage])

    useEffect(() => {
        let active = true
        const load = async () => {
            try {
                setLoading(true)
                setError('')
                const res = await reviewService.getMyReviews({
                    page: currentPage,
                    limit: 5
                })
                if (!active) return
                setReviews(res.data || [])
                setTotal(res.total || 0)
                setTotalPages(res.totalPages || 1)
            } catch (err) {
                if (active) {
                    console.error(err)
                    setError('Failed to fetch your reviews list.')
                }
            } finally {
                if (active) setLoading(false)
            }
        }
        load()
        return () => { active = false }
    }, [currentPage])

    const handleOpenEdit = (review) => {
        setReviewToEdit(review)
        setEditRating(review.rating)
        setEditComment(review.comment || '')
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        if (!reviewToEdit) return
        try {
            setIsSavingEdit(true)
            await reviewService.updateReview(reviewToEdit._id, {
                rating: editRating,
                comment: editComment.trim()
            })
            addToast('Review updated successfully.')
            setReviewToEdit(null)
            fetchReviews()
        } catch (err) {
            console.error(err)
            addToast('Failed to update review.', 'error')
        } finally {
            setIsSavingEdit(false)
        }
    }

    const handleDeleteSubmit = async () => {
        if (!reviewToDelete) return
        try {
            setIsDeleting(true)
            await reviewService.deleteReview(reviewToDelete._id)
            addToast('Review deleted successfully.')
            setReviewToDelete(null)
            fetchReviews()
        } catch (err) {
            console.error(err)
            addToast('Failed to delete review.', 'error')
        } finally {
            setIsDeleting(false)
        }
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    My Reviews ({total})
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage and edit details of medical consultations reviews you've written.
                </p>
            </div>

            {error ? (
                <ErrorState message={error} onRetry={fetchReviews} />
            ) : loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-5 space-y-3">
                            <div className="flex items-center gap-3">
                                <Skeleton variant="circular" width={40} height={40} />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton width={120} height={16} />
                                    <Skeleton width={80} height={12} />
                                </div>
                            </div>
                            <Skeleton width="100%" height={16} />
                            <Skeleton width="60%" height={16} />
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <EmptyState
                    title="No reviews posted yet"
                    description="When you complete appointments, you can write reviews about your experience."
                    icon={FiMessageSquare}
                />
            ) : (
                <div className="space-y-4">
                    {reviews.map((rev) => (
                        <div
                            key={rev._id}
                            className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        src={rev.doctor?.user?.profileImage}
                                        name={rev.doctor?.user?.name || 'Doctor'}
                                        size="md"
                                    />
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-850 dark:text-gray-200">
                                            Dr. {rev.doctor?.user?.name || 'Doctor'}
                                        </h3>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                            {rev.doctor?.specialty}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-100 dark:border-amber-900/50">
                                        <FiStar className="fill-amber-500 text-amber-500" size={12} />
                                        {rev.rating.toFixed(1)}
                                    </div>
                                    <div className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                        <FiCalendar />
                                        {formatDate(rev.createdAt)}
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-850/50 border border-gray-100 dark:border-gray-800 rounded-xl p-3.5 italic">
                                "{rev.comment}"
                            </p>

                            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-850">
                                <button
                                    onClick={() => handleOpenEdit(rev)}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors cursor-pointer"
                                    title="Edit review"
                                >
                                    <FiEdit2 size={15} />
                                </button>
                                <button
                                    onClick={() => setReviewToDelete(rev)}
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                                    title="Delete review"
                                >
                                    <FiTrash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}

            {/* Edit Review Modal */}
            <Modal
                isOpen={!!reviewToEdit}
                onClose={() => setReviewToEdit(null)}
                title="Edit Your Review"
                size="md"
            >
                {reviewToEdit && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                            <Avatar
                                src={reviewToEdit.doctor?.user?.profileImage}
                                name={reviewToEdit.doctor?.user?.name}
                                size="sm"
                            />
                            <div>
                                <h4 className="text-xs font-bold text-gray-850 dark:text-gray-200">
                                    Dr. {reviewToEdit.doctor?.user?.name}
                                </h4>
                                <p className="text-[10px] text-gray-400">{reviewToEdit.doctor?.specialty}</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">
                                Your Rating
                            </label>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((stars) => (
                                    <button
                                        key={stars}
                                        type="button"
                                        onClick={() => setEditRating(stars)}
                                        className="text-amber-400 hover:scale-110 transition cursor-pointer"
                                    >
                                        <FiStar className={stars <= editRating ? "fill-amber-400" : ""} size={22} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5 flex flex-col">
                            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">
                                Review Comment
                            </label>
                            <Textarea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                placeholder="Edit your review details..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <Button variant="ghost" size="sm" type="button" onClick={() => setReviewToEdit(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" isLoading={isSavingEdit}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Delete Review Confirm Modal */}
            <ConfirmModal
                isOpen={!!reviewToDelete}
                onClose={() => setReviewToDelete(null)}
                onConfirm={handleDeleteSubmit}
                title="Delete Review"
                message="Are you sure you want to delete this review?"
                detail="This action is permanent and will remove the review from the doctor's profile page and recalculate ratings."
                confirmLabel="Delete Review"
                isLoading={isDeleting}
                className="delete-review-confirm"
            />
        </div>
    )
}

export default MyReviews
