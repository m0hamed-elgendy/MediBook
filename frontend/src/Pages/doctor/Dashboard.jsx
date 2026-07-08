import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
    FiUsers, FiStar, FiClock, FiMoreVertical, FiCalendar, FiMessageSquare
} from 'react-icons/fi'
import doctorService from '../../services/doctor.service'
import Skeleton from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'

const typeStyles = {
    consultation: { bg: '#1565C0', label: 'CONSULTATION' },
    'follow-up': { bg: '#0D47A1', label: 'FOLLOW-UP' },
    followup: { bg: '#0D47A1', label: 'FOLLOW-UP' },
    checkup: { bg: '#2E7D32', label: 'CHECK-UP' },
}

const scheduleStatusStyles = {
    confirmed: { color: '#16A34A', label: 'Confirmed' },
    'in-progress': { color: '#D97706', label: 'In Progress' },
    inprogress: { color: '#D97706', label: 'In Progress' },
    waiting: { color: '#DC2626', label: 'Waiting' },
    pending: { color: '#64748B', label: 'Pending' },
    completed: { color: '#16A34A', label: 'Completed' },
    cancelled: { color: '#DC2626', label: 'Cancelled' },
}

const DoctorDashboard = () => {
    // Stats state
    const [stats, setStats] = useState(null)
    const [statsLoading, setStatsLoading] = useState(true)
    const [statsError, setStatsError] = useState('')

    // Today Schedule state
    const [todaySchedule, setTodaySchedule] = useState([])
    const [todayLoading, setTodayLoading] = useState(true)
    const [todayError, setTodayError] = useState('')

    // Reviews state
    const [reviews, setReviews] = useState([])
    const [reviewsLoading, setReviewsLoading] = useState(true)
    const [reviewsError, setReviewsError] = useState('')

    // Monthly stats state
    const [monthly, setMonthly] = useState([])
    const [monthlyLoading, setMonthlyLoading] = useState(true)
    const [monthlyError, setMonthlyError] = useState('')

    // Status distribution state
    const [statusDist, setStatusDist] = useState([])
    const [statusLoading, setStatusLoading] = useState(true)
    const [statusError, setStatusError] = useState('')

    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true)
            setStatsError('')
            const data = await doctorService.getDashboard()
            setStats(data)
        } catch (err) {
            console.error(err)
            setStatsError('Failed to load dashboard statistics.')
        } finally {
            setStatsLoading(false)
        }
    }, [])

    const fetchTodaySchedule = useCallback(async () => {
        try {
            setTodayLoading(true)
            setTodayError('')
            const data = await doctorService.getTodaySchedule()
            setTodaySchedule(data || [])
        } catch (err) {
            console.error(err)
            setTodayError("Failed to load today's schedule list.")
        } finally {
            setTodayLoading(false)
        }
    }, [])

    const fetchReviews = useCallback(async () => {
        try {
            setReviewsLoading(true)
            setReviewsError('')
            const data = await doctorService.getRecentReviews()
            setReviews(data || [])
        } catch (err) {
            console.error(err)
            setReviewsError('Failed to load recent reviews.')
        } finally {
            setReviewsLoading(false)
        }
    }, [])

    const fetchMonthly = useCallback(async () => {
        try {
            setMonthlyLoading(true)
            setMonthlyError('')
            const data = await doctorService.getMonthlyAppointments()
            setMonthly(data || [])
        } catch (err) {
            console.error(err)
            setMonthlyError('Failed to load monthly appointments chart.')
        } finally {
            setMonthlyLoading(false)
        }
    }, [])

    const fetchStatus = useCallback(async () => {
        try {
            setStatusLoading(true)
            setStatusError('')
            const data = await doctorService.getStatusDistribution()
            setStatusDist(data || [])
        } catch (err) {
            console.error(err)
            setStatusError('Failed to load status distribution.')
        } finally {
            setStatusLoading(false)
        }
    }, [])

    useEffect(() => {
        Promise.resolve().then(() => {
            fetchStats()
            fetchTodaySchedule()
            fetchReviews()
            fetchMonthly()
            fetchStatus()
        })
    }, [fetchStats, fetchTodaySchedule, fetchReviews, fetchMonthly, fetchStatus])

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const maxBarCount = Math.max(...monthly.map(m => m.count), 1)

    // Compute status ring data based on backend status keys
    const totalMonthly = statusDist.reduce((sum, s) => sum + s.count, 0) || 0
    const statusRingData = [
        { label: 'Pending', color: '#94A3B8', count: 0, pct: 0 },
        { label: 'Confirmed', color: '#10B981', count: 0, pct: 0 },
        { label: 'Completed', color: '#3B82F6', count: 0, pct: 0 },
        { label: 'Cancelled', color: '#EF4444', count: 0, pct: 0 },
    ]

    statusRingData.forEach(item => {
        const match = statusDist.find(s => s.status === item.label.toLowerCase())
        if (match) {
            item.count = match.count
            item.pct = totalMonthly > 0 ? Math.round((match.count / totalMonthly) * 100) : 0
        }
    })

    // SVG ring calculations
    const ringRadius = 70
    const ringCircumference = 2 * Math.PI * ringRadius
    let currentOffset = 0

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FiStar
                key={i}
                size={13}
                className={i < rating ? 'dd-star-filled' : 'dd-star-empty'}
                style={i < rating ? { fill: '#F59E0B', color: '#F59E0B' } : { color: '#D1D5DB' }}
            />
        ))
    }

    return (
        <div className="dd-container">

            {/* ===== Stats Row ===== */}
            <div className="dd-stats-row">
                {statsLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="dd-stat-card">
                            <Skeleton variant="rectangular" height={16} width="40%" />
                            <Skeleton variant="rectangular" height={36} width="60%" className="mt-3" />
                        </div>
                    ))
                ) : statsError ? (
                    <div className="col-span-full w-full">
                        <ErrorState message={statsError} onRetry={fetchStats} compact />
                    </div>
                ) : (
                    <>
                        <div className="dd-stat-card">
                            <div className="dd-stat-top">
                                <span className="dd-stat-label">Total Patients</span>
                                <span className="dd-stat-icon dd-stat-icon-blue">
                                    <FiUsers size={18} />
                                </span>
                            </div>
                            <div className="text-xs font-semibold text-gray-400 mt-3 bg-gray-50 dark:bg-gray-900/50 py-1.5 px-2 rounded-lg inline-block">
                                Feature not available yet
                            </div>
                        </div>

                        <div className="dd-stat-card">
                            <div className="dd-stat-top">
                                <span className="dd-stat-label">Average Rating</span>
                                <span className="dd-stat-icon dd-stat-icon-amber">
                                    <FiStar size={18} />
                                </span>
                            </div>
                            <div className="dd-stat-value-row">
                                <span className="dd-stat-value">{stats?.averageRating ? `${stats.averageRating}` : '0'}/5</span>
                                <div className="dd-stat-stars">
                                    {renderStars(Math.round(stats?.averageRating || 0))}
                                </div>
                            </div>
                        </div>

                        <div className="dd-stat-card">
                            <div className="dd-stat-top">
                                <span className="dd-stat-label">Pending Requests</span>
                                <span className="dd-stat-icon dd-stat-icon-red">
                                    <FiClock size={18} />
                                </span>
                            </div>
                            <div className="dd-stat-value dd-stat-value-accent">
                                {stats?.pendingAppointments || '0'}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ===== Middle Row: Schedule + Status Ring ===== */}
            <div className="dd-middle-row">

                {/* Today's Schedule */}
                <div className="dd-schedule-card">
                    <div className="dd-card-header">
                        <h3 className="dd-card-title">Today's Schedule</h3>
                        <Link to="/doctor/schedule" className="dd-view-all">View All</Link>
                    </div>

                    {todayLoading ? (
                        <div className="dd-schedule-loading p-6 space-y-4">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} variant="rectangular" height={44} />
                            ))}
                        </div>
                    ) : todayError ? (
                        <div className="p-6">
                            <ErrorState message={todayError} onRetry={fetchTodaySchedule} compact />
                        </div>
                    ) : todaySchedule.length === 0 ? (
                        <div className="p-6">
                            <EmptyState
                                title="No appointments today"
                                description="You have no consultation sessions scheduled for today."
                                icon={FiCalendar}
                            />
                        </div>
                    ) : (
                        <div className="dd-schedule-table-wrap">
                            <table className="dd-schedule-table">
                                <thead>
                                    <tr>
                                        <th>Time Slot</th>
                                        <th>Patient</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todaySchedule.map(appt => {
                                        const type = typeStyles[appt.type?.toLowerCase()] || typeStyles.consultation
                                        const status = scheduleStatusStyles[appt.status?.toLowerCase()] || scheduleStatusStyles.pending
                                        return (
                                            <tr key={appt._id}>
                                                <td className="dd-time-cell">{appt.time}</td>
                                                <td className="text-sm font-semibold text-gray-800">
                                                    {appt.patient?.name || 'Unknown Patient'}
                                                </td>
                                                <td>
                                                    <span
                                                        className="dd-type-badge"
                                                        style={{ background: type.bg }}
                                                    >
                                                        {type.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="dd-status-dot-label">
                                                        <span
                                                            className="dd-status-dot"
                                                            style={{ background: status.color }}
                                                        />
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="dd-actions-btn">
                                                        <FiMoreVertical size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Appointment Status Ring */}
                <div className="dd-status-card">
                    <h3 className="dd-card-title">Appointment Status</h3>
                    
                    {statusLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Skeleton variant="circular" height={140} width={140} />
                            <Skeleton variant="rectangular" height={16} width="60%" />
                        </div>
                    ) : statusError ? (
                        <div className="p-6">
                            <ErrorState message={statusError} onRetry={fetchStatus} compact />
                        </div>
                    ) : totalMonthly === 0 ? (
                        <div className="p-6">
                            <EmptyState
                                title="No distribution data"
                                description="Appointment status distribution is currently empty."
                            />
                        </div>
                    ) : (
                        <>
                            <div className="dd-ring-wrapper">
                                <svg viewBox="0 0 180 180" className="dd-ring-svg">
                                    {/* Background ring */}
                                    <circle cx="90" cy="90" r={ringRadius} fill="none" stroke="#F1F5F9" strokeWidth="14" />
                                    {/* Render segment arcs dynamically */}
                                    {statusRingData.map((item) => {
                                        if (item.count === 0) return null
                                        const segmentDash = (item.pct / 100) * ringCircumference
                                        const strokeDasharray = `${segmentDash} ${ringCircumference - segmentDash}`
                                        const strokeDashoffset = -currentOffset
                                        currentOffset += segmentDash

                                        return (
                                            <circle
                                                key={item.label}
                                                cx="90"
                                                cy="90"
                                                r={ringRadius}
                                                fill="none"
                                                stroke={item.color}
                                                strokeWidth="14"
                                                strokeDasharray={strokeDasharray}
                                                strokeDashoffset={strokeDashoffset}
                                                strokeLinecap="round"
                                                transform="rotate(-90 90 90)"
                                            />
                                        )
                                    })}
                                    {/* Center text */}
                                    <text x="90" y="84" textAnchor="middle" className="dd-ring-count">
                                        {totalMonthly}
                                    </text>
                                    <text x="90" y="102" textAnchor="middle" className="dd-ring-label">
                                        TOTAL MONTHLY
                                    </text>
                                </svg>
                            </div>
                            <div className="dd-ring-legend">
                                {statusRingData.map(item => (
                                    <div key={item.label} className="dd-ring-legend-item">
                                        <span className="dd-ring-legend-dot" style={{ background: item.color }} />
                                        <span className="dd-ring-legend-text">{item.label}</span>
                                        <span className="dd-ring-legend-pct">{item.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ===== Bottom Row: Chart + Reviews ===== */}
            <div className="dd-bottom-row">

                {/* Patient Visits Bar Chart */}
                <div className="dd-chart-card">
                    <div className="dd-card-header">
                        <h3 className="dd-card-title">Patient Visits</h3>
                        <span className="dd-chart-filter">Last 6 Months</span>
                    </div>

                    {monthlyLoading ? (
                        <div className="dd-chart-loading p-6 flex items-end justify-between h-[200px] gap-3">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                    <Skeleton variant="rectangular" className="w-full flex-1" style={{ height: `${i * 30}px` }} />
                                    <Skeleton variant="rectangular" height={10} width="80%" />
                                </div>
                            ))}
                        </div>
                    ) : monthlyError ? (
                        <div className="p-6">
                            <ErrorState message={monthlyError} onRetry={fetchMonthly} compact />
                        </div>
                    ) : monthly.length === 0 ? (
                        <div className="p-6">
                            <EmptyState
                                title="No visit data"
                                description="Patient visits analytics are currently empty."
                            />
                        </div>
                    ) : (
                        <div className="dd-chart-area">
                            <div className="dd-chart-bars">
                                {monthly.map((m, i) => (
                                    <div key={i} className="dd-chart-col">
                                        <div className="dd-chart-bar-track">
                                            <div
                                                className="dd-chart-bar"
                                                style={{ height: `${(m.count / maxBarCount) * 100}%` }}
                                            />
                                        </div>
                                        <span className="dd-chart-month">{monthNames[m.month - 1]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Reviews */}
                <div className="dd-reviews-card">
                    <div className="dd-card-header" style={{ padding: '0 0 16px', borderBottom: 'none' }}>
                        <h3 className="dd-card-title">Recent Reviews</h3>
                    </div>

                    {reviewsLoading ? (
                        <div className="dd-reviews-loading space-y-4">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} variant="rectangular" height={64} />
                            ))}
                        </div>
                    ) : reviewsError ? (
                        <ErrorState message={reviewsError} onRetry={fetchReviews} compact />
                    ) : reviews.length === 0 ? (
                        <EmptyState
                            title="No reviews yet"
                            description="You have not received any review feedback from patients yet."
                            icon={FiMessageSquare}
                        />
                    ) : (
                        <>
                            <div className="dd-reviews-list">
                                {reviews.slice(0, 3).map(review => (
                                    <div key={review._id} className="dd-review-item">
                                        <div className="dd-review-header">
                                            <span className="dd-review-name">{review.patient?.name || 'Anonymous'}</span>
                                            <div className="dd-review-stars">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <p className="dd-review-text">"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                            <Link to="/doctor/reviews" className="dd-reviews-viewall block mt-4 text-center">
                                Read All Reviews
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard