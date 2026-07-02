import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    FiUsers, FiStar, FiClock, FiMoreVertical, FiChevronRight
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import doctorService from '../../services/doctor.service'

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
    const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [todaySchedule, setTodaySchedule] = useState([])
    const [reviews, setReviews] = useState([])
    const [monthly, setMonthly] = useState([])
    const [statusDist, setStatusDist] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true)
                setError('')
                const [statsData, todayData, reviewsData, monthlyData, statusData] = await Promise.all([
                    doctorService.getDashboard(),
                    doctorService.getTodaySchedule(),
                    doctorService.getRecentReviews(),
                    doctorService.getMonthlyAppointments(),
                    doctorService.getStatusDistribution(),
                ])
                setStats(statsData)
                setTodaySchedule(todayData || [])
                setReviews(reviewsData || [])
                setMonthly(monthlyData || [])
                setStatusDist(statusData || [])
            } catch (err) {
                console.error(err)
                setError(err.response?.data?.message || 'Failed to fetch dashboard statistics')
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const maxBarCount = Math.max(...monthly.map(m => m.count), 1)

    // Compute status ring data
    const totalMonthly = statusDist.reduce((sum, s) => sum + s.count, 0) || 0
    const statusRingData = [
        { label: 'Completed', color: '#3B82F6', pct: 0 },
        { label: 'Cancelled', color: '#EF4444', pct: 0 },
        { label: 'No-show', color: '#E2E8F0', pct: 0 },
    ]
    if (totalMonthly > 0) {
        const completedCount = statusDist.find(s => s.status === 'completed')?.count || 0
        const cancelledCount = statusDist.find(s => s.status === 'cancelled')?.count || 0
        const noShowCount = totalMonthly - completedCount - cancelledCount
        statusRingData[0].pct = Math.round((completedCount / totalMonthly) * 100)
        statusRingData[1].pct = Math.round((cancelledCount / totalMonthly) * 100)
        statusRingData[2].pct = 100 - statusRingData[0].pct - statusRingData[1].pct
    }

    // SVG ring calculations
    const ringRadius = 70
    const ringCircumference = 2 * Math.PI * ringRadius
    const completedDash = (statusRingData[0].pct / 100) * ringCircumference
    const cancelledDash = (statusRingData[1].pct / 100) * ringCircumference
    const noShowDash = (statusRingData[2].pct / 100) * ringCircumference

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

            {/* Error Banner */}
            {error && (
                <div style={{
                    padding: '16px 24px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '12px',
                    color: '#DC2626',
                    fontSize: '14px',
                    fontWeight: 500,
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <FiClock size={18} />
                    {error}
                </div>
            )}

            {/* ===== Stats Row ===== */}
            <div className="dd-stats-row">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="dd-stat-card dd-skeleton-card">
                            <div className="dd-skeleton-block" style={{ width: '60%', height: 14 }} />
                            <div className="dd-skeleton-block" style={{ width: '40%', height: 36, marginTop: 8 }} />
                        </div>
                    ))
                ) : (
                    <>
                        <div className="dd-stat-card">
                            <div className="dd-stat-top">
                                <span className="dd-stat-label">Total Patients</span>
                                <span className="dd-stat-icon dd-stat-icon-blue">
                                    <FiUsers size={18} />
                                </span>
                            </div>
                            <div className="dd-stat-value">{stats?.totalPatients?.toLocaleString() || stats?.totalAppointments?.toLocaleString() || '0'}</div>
                        </div>

                        <div className="dd-stat-card">
                            <div className="dd-stat-top">
                                <span className="dd-stat-label">Average Rating</span>
                                <span className="dd-stat-icon dd-stat-icon-amber">
                                    <FiStar size={18} />
                                </span>
                            </div>
                            <div className="dd-stat-value-row">
                                <span className="dd-stat-value">{stats?.averageRating || '0'}/5</span>
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

                    {loading ? (
                        <div className="dd-schedule-loading">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="dd-skeleton-row" />
                            ))}
                        </div>
                    ) : todaySchedule.length === 0 ? (
                        <div className="dd-schedule-empty">
                            <FiClock size={36} />
                            <p>No appointments scheduled for today</p>
                        </div>
                    ) : (
                        <div className="dd-schedule-table-wrap">
                            <table className="dd-schedule-table">
                                <thead>
                                    <tr>
                                        <th>Time Slot</th>
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
                    <div className="dd-ring-wrapper">
                        <svg viewBox="0 0 180 180" className="dd-ring-svg">
                            {/* Background ring */}
                            <circle cx="90" cy="90" r={ringRadius} fill="none" stroke="#F1F5F9" strokeWidth="14" />
                            {/* No-show arc */}
                            <circle
                                cx="90" cy="90" r={ringRadius}
                                fill="none"
                                stroke={statusRingData[2].color}
                                strokeWidth="14"
                                strokeDasharray={`${noShowDash} ${ringCircumference - noShowDash}`}
                                strokeDashoffset={-(completedDash + cancelledDash)}
                                strokeLinecap="round"
                                transform="rotate(-90 90 90)"
                            />
                            {/* Cancelled arc */}
                            <circle
                                cx="90" cy="90" r={ringRadius}
                                fill="none"
                                stroke={statusRingData[1].color}
                                strokeWidth="14"
                                strokeDasharray={`${cancelledDash} ${ringCircumference - cancelledDash}`}
                                strokeDashoffset={-completedDash}
                                strokeLinecap="round"
                                transform="rotate(-90 90 90)"
                            />
                            {/* Completed arc */}
                            <circle
                                cx="90" cy="90" r={ringRadius}
                                fill="none"
                                stroke={statusRingData[0].color}
                                strokeWidth="14"
                                strokeDasharray={`${completedDash} ${ringCircumference - completedDash}`}
                                strokeLinecap="round"
                                transform="rotate(-90 90 90)"
                            />
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
                    {loading ? (
                        <div className="dd-chart-loading">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="dd-skeleton-bar" />
                            ))}
                        </div>
                    ) : monthly.length === 0 ? (
                        <div className="dd-schedule-empty" style={{ minHeight: 160 }}>
                            <p>No visit data yet</p>
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
                    <h3 className="dd-card-title" style={{ marginBottom: 16 }}>Recent Reviews</h3>
                    {loading ? (
                        <div className="dd-reviews-loading">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="dd-skeleton-row" style={{ height: 60 }} />
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="dd-schedule-empty" style={{ minHeight: 120 }}>
                            <p>No reviews yet</p>
                        </div>
                    ) : (
                        <div className="dd-reviews-list">
                            {reviews.slice(0, 3).map(review => (
                                <div key={review._id} className="dd-review-item">
                                    <div className="dd-review-header">
                                        <span className="dd-review-name">{review.patient?.name}</span>
                                        <div className="dd-review-stars">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <p className="dd-review-text">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link to="/doctor/reviews" className="dd-reviews-viewall">
                        Read All Reviews
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard