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
import adminService from '../../services/admin.service'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await adminService.getDashboardStats()
        setStats(response)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch dashboard statistics')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (error) {
    return (
      <div className="admin-dashboard">
        <DashboardHeader />
        <div className="admin-error-box">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <DashboardHeader />

      {/* Stat Cards Row */}
      <div className="admin-stats-grid">
        {loading
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

      {/* Charts Row - 3 columns */}
      <div className="admin-charts-row">
        {loading ? (
          <>
            <ChartCardSkeleton />
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </>
        ) : (
          <>
            <AppointmentStatusChart data={stats?.appointmentStatus} />
            <MonthlyChart data={stats?.monthlyAppointments} />
            <UsersStatusChart data={stats?.usersStatus} />
          </>
        )}
      </div>

      {/* Bottom Row - Table + Specialty Chart */}
      <div className="admin-bottom-row">
        {loading ? (
          <>
            <ChartCardSkeleton height={380} />
            <ChartCardSkeleton height={380} />
          </>
        ) : (
          <>
            <TopDoctorsTable doctors={stats?.topDoctors} />
            <SpecialtyChart data={stats?.specialtyDistribution} />
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard