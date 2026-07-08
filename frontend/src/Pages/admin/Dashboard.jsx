import { useState, useEffect, useCallback } from 'react'
import { FiUsers, FiUserCheck, FiCalendar, FiStar, FiX, FiCheck, FiAlertCircle, FiEye } from 'react-icons/fi'
import { FaUserDoctor } from 'react-icons/fa6'
import DashboardHeader from '../../components/admin/DashboardHeader'
import StatCard, { StatCardSkeleton } from '../../components/admin/StatCard'
import ChartCardSkeleton from '../../components/admin/dashboard/ChartCardSkeleton'
import AppointmentStatusChart from '../../components/admin/dashboard/AppointmentStatusChart'
import MonthlyChart from '../../components/admin/dashboard/MonthlyChart'
import UsersStatusChart from '../../components/admin/dashboard/UsersStatusChart'
import TopDoctorsTable from '../../components/admin/dashboard/TopDoctorsTable'
import SpecialtyChart from '../../components/admin/dashboard/SpecialtyChart'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import adminService from '../../services/admin.service'
import doctorApplicationService from '../../services/doctor-application.service'
import { useToast } from '../../context/ToastContext'

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const STAT_CARDS_CONFIG = [
  {
    key: 'users',
    title: 'Users',
    icon: <FiUsers />,
    iconBg: '#EFF6FF',
    iconColor: '#3B82F6',
    getValue: (s) => s?.totalUsers || 0,
    getSubtitle: (s) => `${s?.totalUsers ? '100' : '0'}% of total`,
    subtitleIcon: '↗',
  },
  {
    key: 'doctors',
    title: 'Doctors',
    icon: <FaUserDoctor />,
    iconBg: '#ECFDF5',
    iconColor: '#10B981',
    getValue: (s) => s?.doctors?.count || 0,
    getSubtitle: (s) => `${s?.doctors?.percentage || 0}% of total`,
    subtitleIcon: '↗',
  },
  {
    key: 'patients',
    title: 'Patients',
    icon: <FiUserCheck />,
    iconBg: '#F5F3FF',
    iconColor: '#8B5CF6',
    getValue: (s) => s?.patients?.count || 0,
    getSubtitle: (s) => `${s?.patients?.percentage || 0}% of total`,
    subtitleIcon: '↗',
  },
  {
    key: 'appointments',
    title: 'Appointments',
    icon: <FiCalendar />,
    iconBg: '#FFF7ED',
    iconColor: '#F97316',
    getValue: (s) => s?.totalAppointments || 0,
    getSubtitle: () => 'Total Appointments',
  },
  {
    key: 'reviews',
    title: 'Reviews',
    icon: <FiStar />,
    iconBg: '#FFFBEB',
    iconColor: '#F59E0B',
    getValue: (s) => s?.totalReviews || 0,
    getSubtitle: () => 'Total Reviews',
  },
]

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [appointmentsAnalytics, setAppointmentsAnalytics] = useState(null)
  const [topDoctors, setTopDoctors] = useState(null)
  const [specialtyData, setSpecialtyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [applicationsError, setApplicationsError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const [rejectModal, setRejectModal] = useState({ open: false, id: null })
  const [rejectionReason, setRejectionReason] = useState('')

  const [imageModal, setImageModal] = useState({ open: false, src: '' })

  const { showToast } = useToast()

  useEffect(() => {
    let cancelled = false
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const results = await Promise.allSettled([
          adminService.getDashboardStats(),
          adminService.getAppointmentsAnalytics(),
          adminService.getTopDoctors(),
          adminService.getDoctorsBySpecialty(),
        ])

        if (cancelled) return

        if (results[0].status === 'fulfilled') {
          setStats(results[0].value)
        } else {
          console.error('Failed to fetch dashboard stats:', results[0].reason)
          setError('Failed to fetch dashboard statistics')
        }

        if (results[1].status === 'fulfilled') {
          setAppointmentsAnalytics(results[1].value)
        } else {
          console.error('Failed to fetch appointments analytics:', results[1].reason)
        }

        if (results[2].status === 'fulfilled') {
          setTopDoctors(results[2].value)
        } else {
          console.error('Failed to fetch top doctors:', results[2].reason)
        }

        if (results[3].status === 'fulfilled') {
          setSpecialtyData(results[3].value)
        } else {
          console.error('Failed to fetch specialty data:', results[3].reason)
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err)
          setError('Failed to fetch dashboard data')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadDashboard()
    return () => { cancelled = true }
  }, [])

  const fetchApplications = useCallback(async () => {
    try {
      setApplicationsLoading(true)
      setApplicationsError('')
      const data = await doctorApplicationService.getApplications()
      setApplications(Array.isArray(data) ? data.filter((app) => app.status === 'pending') : [])
    } catch (err) {
      console.error('Failed to fetch doctor applications:', err)
      setApplicationsError('Failed to load doctor applications')
    } finally {
      setApplicationsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleRetry = () => {
    window.location.reload()
  }

  const handleApprove = async (id) => {
    try {
      setActionLoading(id)
      await doctorApplicationService.approveApplication(id)
      showToast('Doctor application approved successfully', 'success')
      setApplications((prev) => prev.filter((app) => app._id !== id))
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to approve application', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const openRejectModal = (id) => {
    setRejectModal({ open: true, id })
    setRejectionReason('')
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error')
      return
    }
    const id = rejectModal.id
    try {
      setActionLoading(id)
      await doctorApplicationService.rejectApplication(id, rejectionReason.trim())
      showToast('Doctor application rejected', 'success')
      setRejectModal({ open: false, id: null })
      setApplications((prev) => prev.filter((app) => app._id !== id))
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to reject application', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Transform backend data into shapes each chart component expects

  // AppointmentStatusChart expects: { pending, confirmed, completed, cancelled }
  const appointmentStatusData = stats
    ? {
        pending: stats.pendingAppointments?.count || 0,
        confirmed: stats.confirmedAppointments?.count || 0,
        completed: stats.completed?.count || 0,
        cancelled: stats.cancelled?.count || 0,
      }
    : null

  // MonthlyChart expects: [{ name: 'Jan', appointments: 18 }, ...]
  const monthlyChartData = appointmentsAnalytics?.byMonth
    ? appointmentsAnalytics.byMonth.map((item) => ({
        name: MONTH_NAMES[item.month] || `M${item.month}`,
        appointments: item.count,
      }))
    : null

  // UsersStatusChart expects: { active, inactive }
  const usersStatusData = stats
    ? {
        active: stats.activeUsers?.count || 0,
        inactive: stats.inactiveUsers?.count || 0,
      }
    : null

  // TopDoctorsTable expects: [{ name, specialty, appointments, rating }]
  const topDoctorsData = topDoctors
    ? topDoctors.map((doc) => ({
        name: doc.name,
        specialty: doc.specialty,
        appointments: doc.totalAppointments,
        rating: doc.averageRating ? Number(doc.averageRating).toFixed(1) : '0.0',
      }))
    : null

  // SpecialtyChart expects: [{ name, value }]
  const specialtyChartData = specialtyData
    ? specialtyData.map((item) => ({
        name: item.specialty,
        value: item.count,
      }))
    : null

  return (
    <div className="admin-dashboard">
      <DashboardHeader />

      {/* Stat Cards Row — always rendered */}
      <div className="admin-stats-grid">
        {loading
          ? Array.from({ length: 5 }, (_, i) => <StatCardSkeleton key={i} />)
          : error && !stats
            ? Array.from({ length: 5 }, (_, i) => <StatCardSkeleton key={i} />)
            : STAT_CARDS_CONFIG.map((card) => (
                <StatCard
                  key={card.key}
                  title={card.title}
                  value={card.getValue(stats)}
                  subtitle={card.getSubtitle(stats)}
                  subtitleIcon={card.subtitleIcon}
                  icon={card.icon}
                  iconBg={card.iconBg}
                  iconColor={card.iconColor}
                />
              ))
        }
      </div>

      {/* Charts Row — 3 columns */}
      <div className="admin-charts-row">
        {loading ? (
          <>
            <ChartCardSkeleton />
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </>
        ) : error && !stats ? (
          <>
            <ErrorState
              title="Failed to load chart data"
              message="Appointment status chart is unavailable."
              onRetry={handleRetry}
              compact
            />
            <ErrorState
              title="Failed to load chart data"
              message="Monthly trend chart is unavailable."
              onRetry={handleRetry}
              compact
            />
            <ErrorState
              title="Failed to load chart data"
              message="User status distribution is unavailable."
              onRetry={handleRetry}
              compact
            />
          </>
        ) : (
          <>
            <AppointmentStatusChart data={appointmentStatusData} />
            <MonthlyChart data={monthlyChartData} />
            <UsersStatusChart data={usersStatusData} />
          </>
        )}
      </div>

      {/* Bottom Row — Table + Specialty Chart */}
      <div className="admin-bottom-row">
        {loading ? (
          <>
            <ChartCardSkeleton height={380} />
            <ChartCardSkeleton height={380} />
          </>
        ) : error && !stats ? (
          <>
            <ErrorState
              title="Failed to load top doctors"
              message="Top performing doctors table is unavailable."
              onRetry={handleRetry}
              compact
            />
            <ErrorState
              title="Failed to load specialty data"
              message="Specialty distribution chart is unavailable."
              onRetry={handleRetry}
              compact
            />
          </>
        ) : (
          <>
            <TopDoctorsTable doctors={topDoctorsData} />
            <SpecialtyChart data={specialtyChartData} />
          </>
        )}
      </div>

      {/* Pending Doctor Applications Section */}
      <div style={{ marginTop: '24px' }}>
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <h3 className="admin-chart-title">Pending Doctor Applications</h3>
          </div>

          {applicationsLoading ? (
            <div style={{ padding: '32px 0' }}>
              <ChartCardSkeleton height={200} />
            </div>
          ) : applicationsError ? (
            <ErrorState
              title="Failed to load applications"
              message={applicationsError}
              onRetry={fetchApplications}
              compact
            />
          ) : applications.length === 0 ? (
            <EmptyState
              title="No pending applications"
              description="There are no pending doctor applications to review."
              icon={FiAlertCircle}
            />
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-top-doctors-table" style={{ minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Specialty</th>
                    <th>Submitted Date</th>
                    <th>License Image</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <span className="admin-doctor-name">{app.user?.name || 'N/A'}</span>
                      </td>
                      <td>
                        <span
                          className="admin-specialty-badge"
                          style={{
                            backgroundColor: '#3B82F618',
                            color: '#3B82F6',
                          }}
                        >
                          {app.specialty}
                        </span>
                      </td>
                      <td style={{ color: '#64748B', fontSize: '13px' }}>
                        {formatDate(app.createdAt)}
                      </td>
                      <td>
                        {app.licenseImage ? (
                          <button
                            onClick={() => setImageModal({ open: true, src: app.licenseImage })}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#3B82F6',
                              background: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              transition: 'all 0.2s',
                            }}
                          >
                            <FiEye size={14} />
                            View Image
                          </button>
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: '12px' }}>No image</span>
                        )}
                      </td>
                      <td>
                        <Badge variant="warning">Pending</Badge>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button
                            size="sm"
                            variant="primary"
                            icon={FiCheck}
                            isLoading={actionLoading === app._id}
                            disabled={actionLoading === app._id}
                            onClick={() => handleApprove(app._id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            icon={FiX}
                            isLoading={actionLoading === app._id}
                            disabled={actionLoading === app._id}
                            onClick={() => openRejectModal(app._id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false, id: null })}
        title="Reject Application"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModal({ open: false, id: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={FiX}
              isLoading={actionLoading === rejectModal.id}
              disabled={actionLoading === rejectModal.id}
              onClick={handleReject}
            >
              Reject
            </Button>
          </>
        }
      >
        <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '12px' }}>
          Please provide a reason for rejecting this doctor application.
        </p>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
          rows={4}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '13px',
            fontFamily: 'inherit',
            color: '#1E293B',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3B82F6'
            e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E5E7EB'
            e.target.style.boxShadow = 'none'
          }}
        />
      </Modal>

      {/* License Image Preview Modal */}
      <Modal
        isOpen={imageModal.open}
        onClose={() => setImageModal({ open: false, src: '' })}
        title="License Image"
        size="lg"
        closeOnOverlayClick
      >
        {imageModal.src && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={imageModal.src}
              alt="License"
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                borderRadius: '8px',
                objectFit: 'contain',
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AdminDashboard
