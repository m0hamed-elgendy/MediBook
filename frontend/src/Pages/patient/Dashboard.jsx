import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    FiCalendar, FiClock, FiSearch, FiPlusCircle,
    FiChevronRight, FiActivity, FiFileText, FiRefreshCw
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import appointmentService from '../../services/appointment.service'

const statusStyles = {
    pending: { bg: '#FFF7ED', color: '#C2410C', label: 'PENDING' },
    confirmed: { bg: '#EFF6FF', color: '#1D4ED8', label: 'CONFIRMED' },
    completed: { bg: '#F0FDF4', color: '#15803D', label: 'COMPLETED' },
    cancelled: { bg: '#FEF2F2', color: '#DC2626', label: 'CANCELLED' },
}

const PatientDashboard = () => {
    const { user } = useAuth()
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true)
                const data = await appointmentService.getByPatient()
                setAppointments(data.data || [])
            } catch (err) {
                console.error(err)
                setAppointments([])
            } finally {
                setLoading(false)
            }
        }
        fetchAppointments()
    }, [])

    const totalAppointments = appointments.length
    const upcoming = appointments
        .filter(a => a.status === 'confirmed' || a.status === 'pending')
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0]
    const completedCount = appointments.filter(a => a.status === 'completed').length
    const firstName = user?.name?.split(' ')[0] || 'there'

    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <div className="pd-container">
            {/* ===== Main Content Area ===== */}
            <div className="pd-content">

                {/* Welcome Header */}
                <div className="pd-welcome">
                    <h1 className="pd-welcome-title">Welcome back, {firstName}!</h1>
                    <p className="pd-welcome-subtitle">
                        {upcoming
                            ? `Your health status is looking good. You have an upcoming appointment.`
                            : 'Your health status is looking good. No upcoming appointments.'}
                    </p>
                </div>

                {/* Stats Row */}
                <div className="pd-stats-row">
                    <div className="pd-stat-card">
                        <div className="pd-stat-icon-row">
                            <span className="pd-stat-icon pd-stat-icon-blue">
                                <FiCalendar size={18} />
                            </span>
                        </div>
                        <div className="pd-stat-value pd-stat-value-blue">{totalAppointments}</div>
                        <div className="pd-stat-label">TOTAL APPOINTMENTS</div>
                    </div>

                    <div className="pd-stat-card">
                        <div className="pd-stat-icon-row">
                            <span className="pd-stat-icon pd-stat-icon-amber">
                                <FiClock size={18} />
                            </span>
                            {upcoming && <span className="pd-stat-badge">In {(() => {
                                const diff = Math.ceil((new Date(upcoming.date) - new Date()) / (1000 * 60 * 60 * 24))
                                return diff > 0 ? `${diff} days` : 'Today'
                            })()}</span>}
                        </div>
                        <div className="pd-stat-value pd-stat-value-amber">
                            {upcoming ? formatDate(upcoming.date) : '—'}
                        </div>
                        <div className="pd-stat-label">NEXT APPOINTMENT</div>
                    </div>

                    <div className="pd-stat-card">
                        <div className="pd-stat-icon-row">
                            <span className="pd-stat-icon pd-stat-icon-green">
                                <FiActivity size={18} />
                            </span>
                        </div>
                        <div className="pd-stat-value pd-stat-value-green">{completedCount}</div>
                        <div className="pd-stat-label">COMPLETED VISITS</div>
                    </div>
                </div>

                {/* Upcoming Appointment Banner */}
                {upcoming && (
                    <div className="pd-upcoming-banner">
                        <div className="pd-upcoming-content">
                            <div className="pd-upcoming-avatar">
                                {upcoming.doctor?.user?.name?.charAt(0).toUpperCase() || 'D'}
                            </div>
                            <div className="pd-upcoming-info">
                                <span className="pd-upcoming-label">UPCOMING APPOINTMENT</span>
                                <h3 className="pd-upcoming-doctor">
                                    Dr. {upcoming.doctor?.user?.name || 'Doctor'}
                                </h3>
                                <p className="pd-upcoming-meta">
                                    {upcoming.doctor?.specialty} • {formatDate(upcoming.date)}, {upcoming.time}
                                </p>
                            </div>
                        </div>
                        <div className="pd-upcoming-actions">
                            <span className={`pd-upcoming-status-badge ${upcoming.status === 'confirmed' ? 'pd-badge-confirmed' : 'pd-badge-pending'}`}>
                                {upcoming.status}
                            </span>
                        </div>
                    </div>
                )}

                {/* Appointment History */}
                <div className="pd-history-card">
                    <div className="pd-history-header">
                        <h3 className="pd-history-title">Appointment History</h3>
                        <Link to="/patient/appointments" className="pd-history-viewall">
                            View all
                        </Link>
                    </div>

                    {loading ? (
                        <div className="pd-history-loading">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="pd-skeleton-row" />
                            ))}
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="pd-history-empty">
                            <FiCalendar size={40} />
                            <p>No appointments yet.</p>
                            <Link to="/doctors" className="pd-history-empty-link">
                                Find a doctor to get started
                            </Link>
                        </div>
                    ) : (
                        <div className="pd-history-table-wrapper">
                            <table className="pd-history-table">
                                <thead>
                                    <tr>
                                        <th>DOCTOR</th>
                                        <th>DATE</th>
                                        <th>STATUS</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.slice(0, 5).map(appt => {
                                        const style = statusStyles[appt.status] || statusStyles.pending
                                        return (
                                            <tr key={appt._id}>
                                                <td>
                                                    <div className="pd-doctor-cell">
                                                        <div
                                                            className="pd-doctor-avatar-sm"
                                                            style={{
                                                                background: appt.status === 'completed' ? '#DCFCE7'
                                                                    : appt.status === 'confirmed' ? '#DBEAFE'
                                                                        : appt.status === 'cancelled' ? '#FEE2E2'
                                                                            : '#FEF3C7',
                                                                color: style.color
                                                            }}
                                                        >
                                                            {appt.doctor?.user?.name?.charAt(0).toUpperCase() || 'D'}
                                                        </div>
                                                        <div>
                                                            <p className="pd-doctor-name">
                                                                Dr. {appt.doctor?.user?.name || 'Doctor'}
                                                            </p>
                                                            <p className="pd-doctor-specialty">
                                                                {appt.doctor?.specialty || 'Specialist'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="pd-date-cell">
                                                    {formatDate(appt.date)}
                                                </td>
                                                <td>
                                                    <span
                                                        className="pd-status-badge"
                                                        style={{ background: style.bg, color: style.color }}
                                                    >
                                                        {style.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    {appt.status === 'cancelled' ? (
                                                        <button className="pd-action-btn" title="Rebook">
                                                            <FiRefreshCw size={16} />
                                                        </button>
                                                    ) : (
                                                        <button className="pd-action-btn" title="View Details">
                                                            <FiFileText size={16} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== Right Sidebar ===== */}
            <aside className="pd-sidebar">

                {/* Quick Actions */}
                <div className="pd-sidebar-card">
                    <h3 className="pd-sidebar-card-title">
                        <span className="pd-sidebar-card-title-icon">⚡</span>
                        Quick Actions
                    </h3>
                    <div className="pd-quick-actions">
                        <Link to="/doctors" className="pd-action-link pd-action-primary">
                            <span className="pd-action-link-left">
                                <FiPlusCircle size={18} />
                                Book New Appointment
                            </span>
                            <FiChevronRight size={16} />
                        </Link>
                        <Link to="/doctors" className="pd-action-link pd-action-outline">
                            <span className="pd-action-link-left">
                                <FiSearch size={18} />
                                Find a Specialist
                            </span>
                            <FiChevronRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Health Tip */}
                <div className="pd-sidebar-card pd-tip-card">
                    <div className="pd-tip-icon">💡</div>
                    <h4 className="pd-tip-title">Health Tip of the Day</h4>
                    <p className="pd-tip-text">
                        Stay hydrated! Drinking at least 8 glasses of water daily helps maintain
                        your energy levels and improves cognitive function.
                    </p>
                    <a href="#" className="pd-tip-link">Learn more →</a>
                </div>

            </aside>
        </div>
    )
}

export default PatientDashboard