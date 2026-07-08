import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import appointmentService from '../../services/appointment.service'
import reviewService from '../../services/review.service'
import { useToast } from '../../context/ToastContext'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import Skeleton from '../../components/ui/Skeleton'
import { FiCalendar, FiClock, FiX, FiStar, FiMessageSquare } from 'react-icons/fi'
import Textarea from '../../components/ui/Textarea'

const MyAppointments = () => {
    const { addToast } = useToast()
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Cancel appointment
    const [apptToCancel, setApptToCancel] = useState(null)
    const [isActionLoading, setIsActionLoading] = useState(false)

    // Review appointment modals
    const [apptToReview, setApptToReview] = useState(null)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            setError('')
            const res = await appointmentService.getByPatient({ limit: 100 })
            setAppointments(res.data || [])
        } catch (err) {
            console.error(err)
            setError('Failed to fetch your appointments.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const handleCancelSubmit = async () => {
        if (!apptToCancel) return
        try {
            setIsActionLoading(true)
            await appointmentService.updateStatus(apptToCancel._id, 'cancelled')
            addToast('Appointment cancelled successfully.')
            setApptToCancel(null)
            fetchAppointments()
        } catch (err) {
            console.error(err)
            addToast('Failed to cancel appointment.', 'error')
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        if (!apptToReview) return
        try {
            setIsActionLoading(true)
            await reviewService.create({
                doctor: apptToReview.doctor?._id,
                appointment: apptToReview._id,
                rating,
                comment
            })
            addToast('Review submitted successfully!')
            setApptToReview(null)
            setComment('')
            setRating(5)
            fetchAppointments()
        } catch (err) {
            console.error(err)
            addToast(err.response?.data?.message || 'Failed to submit review.', 'error')
        } finally {
            setIsActionLoading(false)
        }
    }

    const upcoming = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending')
    const completed = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled')

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Appointments</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        View upcoming consultations or look up past diagnostics history.
                    </p>
                </div>
                <Link to="/doctors">
                    <Button variant="primary" size="sm">Book New Appointment</Button>
                </Link>
            </div>

            {error ? (
                <ErrorState message={error} onRetry={fetchAppointments} />
            ) : loading ? (
                <div className="space-y-4">
                    <Skeleton variant="rectangular" height={120} />
                    <Skeleton variant="rectangular" height={120} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Upcoming */}
                    <div className="space-y-4">
                        <h3 className="text-base font-bold text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                            <FiCalendar className="text-blue-500" /> Upcoming Appointments
                        </h3>
                        {upcoming.length === 0 ? (
                            <EmptyState
                                title="No upcoming bookings"
                                description="You have no pending or confirmed bookings at the moment."
                                icon={FiCalendar}
                                actionLabel="Book Appointment"
                                onAction={() => window.location.href = '/doctors'}
                            />
                        ) : (
                            <div className="space-y-3">
                                {upcoming.map((appt) => (
                                    <div
                                        key={appt._id}
                                        className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar src={appt.doctor?.user?.profileImage} name={appt.doctor?.user?.name} size="md" />
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                        Dr. {appt.doctor?.user?.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">{appt.doctor?.specialty}</p>
                                                </div>
                                            </div>
                                            <Badge variant={appt.status}>{appt.status}</Badge>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-850 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <span className="flex items-center gap-1">
                                                <FiCalendar size={13} /> {formatDate(appt.date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiClock size={13} /> {appt.time}
                                            </span>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setApptToCancel(appt)}
                                                className="text-red-655 hover:bg-red-50"
                                            >
                                                Cancel Booking
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Past / History */}
                    <div className="space-y-4">
                        <h3 className="text-base font-bold text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                            <FiActivity className="text-emerald-500" /> Past Consultations
                        </h3>
                        {completed.length === 0 ? (
                            <EmptyState
                                title="No past visits"
                                description="Completed and cancelled appointment logs will show here."
                                icon={FiActivity}
                            />
                        ) : (
                            <div className="space-y-3">
                                {completed.map((appt) => (
                                    <div
                                        key={appt._id}
                                        className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar src={appt.doctor?.user?.profileImage} name={appt.doctor?.user?.name} size="md" />
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                        Dr. {appt.doctor?.user?.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">{appt.doctor?.specialty}</p>
                                                </div>
                                            </div>
                                            <Badge variant={appt.status}>{appt.status}</Badge>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 bg-gray-55 dark:bg-gray-850 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <span className="flex items-center gap-1">
                                                <FiCalendar size={13} /> {formatDate(appt.date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiClock size={13} /> {appt.time}
                                            </span>
                                        </div>

                                        {appt.status === 'completed' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setApptToReview(appt)}
                                                    icon={FiStar}
                                                >
                                                    Review Doctor
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Cancel Appointment Modal */}
            <Modal
                isOpen={!!apptToCancel}
                onClose={() => setApptToCancel(null)}
                title="Cancel Consultation Booking"
                size="sm"
                footer={
                    <>
                        <Button variant="outline" size="sm" onClick={() => setApptToCancel(null)}>
                            Go Back
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            isLoading={isActionLoading}
                            onClick={handleCancelSubmit}
                        >
                            Cancel Appointment
                        </Button>
                    </>
                }
            >
                {apptToCancel && (
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Confirm cancellation request for appointment with <strong>Dr. {apptToCancel.doctor?.user?.name}</strong>.
                        </p>
                        <p className="text-xs text-red-500 font-medium">
                            Cancellation is final and cannot be reversed.
                        </p>
                    </div>
                )}
            </Modal>

            {/* Review Appointment Modal */}
            <Modal
                isOpen={!!apptToReview}
                onClose={() => {
                    setApptToReview(null)
                    setComment('')
                    setRating(5)
                }}
                title="Review Consultation Experience"
                size="md"
                footer={
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setApptToReview(null)
                                setComment('')
                                setRating(5)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            isLoading={isActionLoading}
                            onClick={handleReviewSubmit}
                            disabled={!comment.trim()}
                        >
                            Submit Review
                        </Button>
                    </>
                }
            >
                {apptToReview && (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Doctor: Dr. {apptToReview.doctor?.user?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                Specialization: {apptToReview.doctor?.specialty}
                            </p>
                        </div>

                        {/* Stars input */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Rating</span>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="text-2xl transition-transform duration-100 hover:scale-110 focus:outline-none"
                                    >
                                        <FiStar
                                            className={`w-6 h-6 ${
                                                star <= rating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-300 dark:text-gray-700'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Remarks / Comment
                            </label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Describe your consultation experience..."
                                rows={4}
                                required
                            />
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    )
}

export default MyAppAppointments
