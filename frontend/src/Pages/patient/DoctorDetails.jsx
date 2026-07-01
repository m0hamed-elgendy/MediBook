import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { 
    FiStar, FiMapPin, FiDollarSign, FiCalendar, FiClock, 
    FiUser, FiCheckCircle, FiMessageSquare, FiArrowLeft, FiAlertCircle 
} from 'react-icons/fi'
import doctorService from '../../services/doctor.service'
import appointmentService from '../../services/appointment.service'
import reviewService from '../../services/review.service'
import { useAuth } from '../../context/AuthContext'

const DoctorDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { user } = useAuth()

    const [doctor, setDoctor] = useState(null)
    const [reviews, setReviews] = useState([])
    const [busySlots, setBusySlots] = useState([])
    const [loading, setLoading] = useState(true)
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [submittingBooking, setSubmittingBooking] = useState(false)
    const [bookingError, setBookingError] = useState('')

    // Booking state
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState('')
    const [notes, setNotes] = useState('')

    // Reviews state
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewComment, setReviewComment] = useState('')
    const [reviewError, setReviewError] = useState('')
    const [submittingReview, setSubmittingReview] = useState(false)
    const [unreviewedAppointment, setUnreviewedAppointment] = useState(null)

    // Guard ref to prevent repeated auto-scroll
    const hasAutoScrolled = useRef(false)

    // Scroll to top on mount / when doctor id changes
    useEffect(() => {
        window.scrollTo(0, 0)
        hasAutoScrolled.current = false
    }, [id])

    // Load doctor and reviews
    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const [docData, revsData] = await Promise.all([
                doctorService.getById(id),
                reviewService.getDoctorReviews(id, { limit: 50 })
            ])
            setDoctor(docData)
            setReviews(revsData.data || [])

            // If user is a logged-in patient, find if they have a completed appointment to review
            if (user && user.role === 'patient') {
                const appointmentsRes = await appointmentService.getByPatient({ limit: 100 })
                const myAppointments = appointmentsRes.data || []
                
                // Find completed appointments with this doctor
                const completedWithDoctor = myAppointments.filter(app => 
                    app.doctor && 
                    app.doctor._id === id && 
                    app.status === 'completed'
                )

                // Check if any of these completed appointments has NOT been reviewed yet
                const reviewsRes = await reviewService.getDoctorReviews(id, { limit: 100 })
                const docReviews = reviewsRes.data || []
                const myDocReviews = docReviews.filter(r => r.patient && r.patient._id === user._id)

                const unreviewed = completedWithDoctor.find(app => 
                    !myDocReviews.some(r => r.appointment === app._id || (r.appointment && r.appointment._id === app._id))
                )

                setUnreviewedAppointment(unreviewed || null)
            }
        } catch (err) {
            console.error('Error fetching doctor details:', err)
        } finally {
            setLoading(false)
        }
    }, [id, user])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Generate date list
    const availableDays = doctor?.availability || []
    const dates = doctor ? (() => {
        const list = []
        const weekdayMap = {
            'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 
            'Thursday': 4, 'Friday': 5, 'Saturday': 6
        }
        const targetDays = availableDays.map(d => weekdayMap[d.day])

        for (let i = 0; i < 14; i++) {
            const date = new Date()
            date.setDate(date.getDate() + i)
            const dayNumber = date.getDay()
            const isAvailable = targetDays.includes(dayNumber)
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
            
            // Find specific slot for this day to get hours
            const slotConfig = availableDays.find(d => d.day === dayName)

            list.push({
                date,
                dateString: date.toISOString().split('T')[0],
                dayName,
                formattedDay: date.toLocaleDateString('en-US', { weekday: 'short' }),
                formattedDate: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                isAvailable,
                slotConfig
            })
        }
        return list
    })() : []

    // Load busy slots when date changes
    useEffect(() => {
        const loadBusySlots = async () => {
            if (!selectedDate) return
            try {
                const busy = await doctorService.getBusySlots(id, selectedDate.dateString)
                setBusySlots(busy || [])
            } catch (err) {
                console.error('Error fetching busy slots:', err)
            }
        }
        loadBusySlots()
        setSelectedTime('')
    }, [selectedDate, id])

    // Trigger auto-focus scroll to book container if '?book=true' parameter is present (only once)
    useEffect(() => {
        if (hasAutoScrolled.current) return
        if (doctor && searchParams.get('book') === 'true' && dates.length > 0) {
            hasAutoScrolled.current = true
            // Find first available date and select it
            const firstAvail = dates.find(d => d.isAvailable)
            if (firstAvail) setSelectedDate(firstAvail)
            
            setTimeout(() => {
                const el = document.getElementById('booking-section')
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 300)
        }
    }, [doctor, searchParams, dates])

    // Generate time slots based on selected date's slot config
    const timeSlots = selectedDate && selectedDate.slotConfig ? (() => {
        const slots = []
        const { from, to } = selectedDate.slotConfig
        const duration = doctor?.sessionDuration || 20

        const parseTimeToMinutes = (timeStr) => {
            const [timePart, period] = timeStr.split(' ')
            let [hours, minutes] = timePart.split(':').map(Number)
            if (period === 'AM' && hours === 12) hours = 0
            if (period === 'PM' && hours !== 12) hours += 12
            return hours * 60 + minutes
        }

        const formatMinutesToTime = (totalMinutes) => {
            let hours = Math.floor(totalMinutes / 60)
            const minutes = totalMinutes % 60
            const period = hours >= 12 ? 'PM' : 'AM'
            if (hours > 12) hours -= 12
            if (hours === 0) hours = 12
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`
        }

        const startMin = parseTimeToMinutes(from)
        const endMin = parseTimeToMinutes(to)

        for (let min = startMin; min + duration <= endMin; min += duration) {
            slots.push(formatMinutesToTime(min))
        }
        return slots
    })() : []

    // Booking Submission
    const handleBookAppointment = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/doctors/${id}?book=true` } })
            return
        }
        if (user.role !== 'patient') {
            setBookingError('Only patients can book appointments.')
            return
        }
        if (!selectedDate || !selectedTime) {
            setBookingError('Please choose date and time.')
            return
        }

        try {
            setSubmittingBooking(true)
            setBookingError('')
            await appointmentService.create({
                doctor: id,
                date: selectedDate.dateString,
                time: selectedTime,
                notes: notes.trim()
            })
            setBookingSuccess(true)
            setSelectedTime('')
            setNotes('')
        } catch (err) {
            console.error(err)
            setBookingError(err.response?.data?.message || 'Failed to book appointment. Please try again.')
        } finally {
            setSubmittingBooking(false)
        }
    }

    // Review Submission
    const handlePostReview = async (e) => {
        e.preventDefault()
        if (!unreviewedAppointment) return

        try {
            setSubmittingReview(true)
            setReviewError('')
            await reviewService.create({
                doctor: id,
                appointment: unreviewedAppointment._id,
                rating: reviewRating,
                comment: reviewComment.trim()
            })
            setReviewComment('')
            setReviewRating(5)
            // Reload details to show the new review and update average rating
            await fetchData()
        } catch (err) {
            console.error(err)
            setReviewError(err.response?.data?.message || 'Failed to submit review.')
        } finally {
            setSubmittingReview(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse space-y-8">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="h-44 bg-gray-200 rounded-3xl"></div>
                        <div className="h-28 bg-gray-200 rounded-3xl"></div>
                        <div className="h-56 bg-gray-200 rounded-3xl"></div>
                    </div>
                    <div className="w-full lg:w-96 h-96 bg-gray-200 rounded-3xl"></div>
                </div>
            </div>
        )
    }

    if (!doctor) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-800">Doctor not found</h2>
                <button onClick={() => navigate('/doctors')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold">
                    Go Back
                </button>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            {/* Header / Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <button 
                    onClick={() => navigate('/doctors')}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition cursor-pointer mb-6"
                >
                    <FiArrowLeft size={18} />
                    Back to Search
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Column: Details */}
                    <div className="flex-1 space-y-6">
                        
                        {/* Profile Header */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-4xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                                {doctor.user?.profileImage ? (
                                    <img src={doctor.user.profileImage} alt={doctor.user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    doctor.user?.name?.charAt(0).toUpperCase()
                                )}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h1 className="text-2xl font-extrabold text-gray-850">{doctor.user?.name}</h1>
                                        <p className="text-blue-600 font-semibold text-sm">{doctor.specialty}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl text-sm font-extrabold shrink-0 border border-amber-100">
                                        <FiStar className="fill-amber-500 text-amber-500" size={16} />
                                        {doctor.averageRating ? doctor.averageRating.toFixed(1) : '0.0'}
                                        <span className="text-gray-400 font-normal text-xs">({doctor.reviewsCount || 0} reviews)</span>
                                    </div>
                                </div>

                                <p className="text-gray-500 text-sm italic">"{doctor.bio}"</p>

                                <hr className="border-gray-100 my-3" />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                                        <FiDollarSign size={16} className="text-blue-500" />
                                        <span className="font-semibold text-gray-800">{doctor.consultationPrice} EGP</span> / session
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                                        <FiMapPin size={16} className="text-blue-500 shrink-0" />
                                        <span className="truncate">{doctor.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                                        <FiClock size={16} className="text-blue-500" />
                                        <span>{doctor.sessionDuration} mins / session</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Symptoms & Services */}
                        {(doctor.symptoms?.length > 0 || doctor.services?.length > 0) && (
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                                {doctor.symptoms?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-2">Symptoms Treated</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.symptoms.map(s => (
                                                <span key={s} className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg border border-rose-100">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {doctor.services?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-2">Services Provided</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.services.map(s => (
                                                <span key={s} className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-lg border border-emerald-100">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reviews Summary & List */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FiMessageSquare className="text-blue-500" />
                                Patient Reviews ({reviews.length})
                            </h2>

                            {/* Write Review Form */}
                            {unreviewedAppointment && (
                                <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <h4 className="text-sm font-bold text-blue-900">Write a Review for your Appointment</h4>
                                    </div>
                                    <form onSubmit={handlePostReview} className="space-y-3">
                                        {reviewError && (
                                            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 font-medium">
                                                <FiAlertCircle /> {reviewError}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <label className="text-xs font-bold text-gray-600">Your Rating:</label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(stars => (
                                                    <button 
                                                        key={stars}
                                                        type="button"
                                                        onClick={() => setReviewRating(stars)}
                                                        className="text-amber-400 hover:scale-110 transition cursor-pointer"
                                                    >
                                                        <FiStar className={stars <= reviewRating ? "fill-amber-400" : ""} size={20} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <textarea
                                                rows="3"
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                placeholder="Write about your experience with this doctor..."
                                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 resize-none"
                                                required
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submittingReview}
                                            className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
                                        >
                                            {submittingReview ? 'Submitting...' : 'Post Review'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Reviews list */}
                            {reviews.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-6">No reviews yet for this doctor.</p>
                            ) : (
                                <div className="space-y-4 divide-y divide-gray-150">
                                    {reviews.map((rev, index) => (
                                        <div key={rev._id} className={`pt-4 ${index === 0 ? 'pt-0' : ''}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm">{rev.patient?.name || 'Patient'}</h4>
                                                    <span className="text-gray-400 text-[10px]">{new Date(rev.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-100">
                                                    <FiStar className="fill-amber-500 text-amber-500" size={11} />
                                                    {rev.rating.toFixed(1)}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm">{rev.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
                    <div id="booking-section" className="w-full lg:w-96 sticky top-24">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-6">
                            
                            {bookingSuccess ? (
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                        <FiCheckCircle size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">Booking Confirmed!</h3>
                                    <p className="text-gray-500 text-sm">Your appointment with {doctor.user?.name} has been booked successfully.</p>
                                    <div className="pt-4 flex flex-col gap-2">
                                        <button 
                                            onClick={() => navigate('/patient/dashboard')} 
                                            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition cursor-pointer"
                                        >
                                            Go to Dashboard
                                        </button>
                                        <button 
                                            onClick={() => setBookingSuccess(false)} 
                                            className="w-full py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition cursor-pointer"
                                        >
                                            Book Another Appointment
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">Schedule Appointment</h2>
                                        <p className="text-gray-400 text-xs">Choose your preferred date and time slot</p>
                                    </div>

                                    {bookingError && (
                                        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 font-medium">
                                            <FiAlertCircle className="shrink-0" /> {bookingError}
                                        </div>
                                    )}

                                    {/* Date Picker */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                            <FiCalendar className="text-blue-500" /> Date
                                        </label>
                                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                                            {dates.map((d, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    disabled={!d.isAvailable}
                                                    onClick={() => setSelectedDate(d)}
                                                    className={`px-3.5 py-2.5 rounded-2xl flex flex-col items-center justify-center shrink-0 border transition cursor-pointer ${
                                                        !d.isAvailable 
                                                            ? 'border-gray-100 text-gray-300 opacity-40 cursor-not-allowed'
                                                            : selectedDate?.dateString === d.dateString
                                                                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100'
                                                                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                                                    }`}
                                                >
                                                    <span className="text-[10px] uppercase font-bold tracking-wider">{d.formattedDay}</span>
                                                    <span className="text-sm font-extrabold mt-1">{d.date.getDate()}</span>
                                                    <span className="text-[9px] mt-0.5">{d.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Picker */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                            <FiClock className="text-blue-500" /> Time Slot
                                        </label>
                                        
                                        {!selectedDate ? (
                                            <div className="p-4 border border-dashed border-gray-200 rounded-2xl text-center text-gray-400 text-xs">
                                                Please select a date first to view time slots
                                            </div>
                                        ) : timeSlots.length === 0 ? (
                                            <div className="p-4 bg-gray-50 rounded-2xl text-center text-gray-500 text-xs">
                                                No time slots available for this day.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2">
                                                {timeSlots.map((slot, index) => {
                                                    const isBooked = busySlots.includes(slot)
                                                    return (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            disabled={isBooked}
                                                            onClick={() => setSelectedTime(slot)}
                                                            className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border transition ${
                                                                isBooked
                                                                    ? 'bg-gray-100 border-gray-150 text-gray-300 line-through cursor-not-allowed'
                                                                    : selectedTime === slot
                                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100'
                                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600'
                                                            }`}
                                                        >
                                                            {slot}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Patient Notes */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-600">
                                            Add Notes (Optional)
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Write symptoms or reasons for appointment..."
                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-blue-500 resize-none"
                                        ></textarea>
                                    </div>

                                    {/* Action button */}
                                    <button
                                        type="button"
                                        onClick={handleBookAppointment}
                                        disabled={submittingBooking || !selectedDate || !selectedTime}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        {submittingBooking ? 'Confirming Booking...' : 'Book Now'}
                                    </button>
                                </>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default DoctorDetails