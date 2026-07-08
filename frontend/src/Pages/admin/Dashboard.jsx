import { useState, useEffect } from 'react'
import { FiUsers, FiUserCheck, FiCalendar, FiStar } from 'react-icons/fi'
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
import adminService from '../../services/admin.service'

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

  const handleRetry = () => {
    window.location.reload()
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
    </div>
  )
}

export default AdminDashboard
