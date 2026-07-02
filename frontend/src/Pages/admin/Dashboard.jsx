import React, { useState, useEffect } from 'react'
import { FiUsers, FiUserCheck, FiCalendar, FiStar } from 'react-icons/fi'
import { FaUserDoctor } from 'react-icons/fa6'
import DashboardHeader from '../../components/admin/DashboardHeader'
import StatCard from '../../components/admin/StatCard'
import adminService from '../../services/admin.service'

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

  if (loading) {
    return (
      <div className="p-8">
        <DashboardHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mt-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl border p-6 h-32 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 font-medium">
        <DashboardHeader />
        <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mt-8">
        <StatCard
          title="Users"
          value={stats?.totalUsers || 0}
          percentage={100}
          icon={<FiUsers />}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Doctors"
          value={stats?.doctors?.count || 0}
          percentage={stats?.doctors?.percentage || 0}
          icon={<FaUserDoctor />}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Patients"
          value={stats?.patients?.count || 0}
          percentage={stats?.patients?.percentage || 0}
          icon={<FiUserCheck />}
          color="bg-purple-100 text-purple-600"
        />

        <StatCard
          title="Appointments"
          value={stats?.totalAppointments || 0}
          icon={<FiCalendar />}
          color="bg-orange-100 text-orange-600"
        />

        <StatCard
          title="Reviews"
          value={stats?.totalReviews || 0}
          icon={<FiStar />}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>
    </div>
  )
}

export default AdminDashboard