import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
    FiCalendar, FiClock, FiActivity, FiUser, 
    FiAlertCircle, FiXCircle, FiCheckCircle, FiSearch 
} from 'react-icons/fi'
import appointmentService from '../../services/appointment.service'
import { useAuth } from '../../context/AuthContext'

const PatientDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)
    const [error, setError] = useState('')

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true)
            const res = await appointmentService.getByPatient({ limit: 100 })
            setAppointments(res.data || [])
        } catch (err) {
            console.error('Error fetching patient appointments:', err)
            setError('Failed to load appointments.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    const handleCancelAppointment = useCallback(async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return
        try {
            setCancellingId(id)
            await appointmentService.updateStatus(id, 'cancelled')
            // Refresh list
            await fetchAppointments()
        } catch (err) {
            console.error('Error cancelling appointment:', err)
            alert(err.response?.data?.message || 'Failed to cancel appointment')
        } finally {
            setCancellingId(null)
        }
    }, [fetchAppointments])

    // Calculate metrics
    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length,
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100'
            case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-100'
            case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
            case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100'
            default: return 'bg-gray-50 text-gray-700 border-gray-100'
        }
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse space-y-8">
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-24 bg-gray-200 rounded-3xl"></div>
                    ))}
                </div>
                <div className="h-80 bg-gray-200 rounded-3xl"></div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                
                {/* Welcome */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Patient Dashboard</h1>
                        <p className="text-slate-500 text-sm">Welcome back, {user?.name}. Manage your appointments and healthcare options here.</p>
                    </div>
                    <Link 
                        to="/doctors" 
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-sm transition duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer self-start"
                    >
                        <FiSearch size={16} />
                        Find Doctors
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 text-slate-650 rounded-2xl flex items-center justify-center shrink-0">
                            <FiActivity size={24} />
                        </div>
                        <div>
                            <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Total Booked</span>
                            <span className="text-2xl font-black text-slate-800">{stats.total}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                            <FiCalendar size={24} />
                        </div>
                        <div>
                            <span className="block text-amber-400 text-xs font-bold uppercase tracking-wider">Pending Approval</span>
                            <span className="text-2xl font-black text-amber-600">{stats.pending}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                            <FiClock size={24} />
                        </div>
                        <div>
                            <span className="block text-blue-400 text-xs font-bold uppercase tracking-wider">Confirmed</span>
                            <span className="text-2xl font-black text-blue-600">{stats.confirmed}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                            <FiCheckCircle size={24} />
                        </div>
                        <div>
                            <span className="block text-emerald-400 text-xs font-bold uppercase tracking-wider">Completed</span>
                            <span className="text-2xl font-black text-emerald-600">{stats.completed}</span>
                        </div>
                    </div>
                </div>

                {/* Appointment List Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                        <h2 className="font-bold text-slate-800 text-lg">My Appointments</h2>
                    </div>

                    {error && (
                        <div className="p-6 text-center text-red-500 flex flex-col items-center gap-2">
                            <FiAlertCircle size={32} />
                            <p className="font-semibold">{error}</p>
                        </div>
                    )}

                    {appointments.length === 0 ? (
                        <div className="text-center py-20 px-6 space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                <FiCalendar size={36} />
                            </div>
                            <div>
                                <h3 className="text-slate-800 font-bold text-lg">No appointments scheduled</h3>
                                <p className="text-slate-400 text-sm max-w-sm mx-auto mt-1">Book an appointment with one of our professional medical specialists to get started.</p>
                            </div>
                            <Link 
                                to="/doctors" 
                                className="inline-flex px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition"
                            >
                                Book Appointment
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {appointments.map(app => (
                                <div key={app._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/40 transition duration-300">
                                    <div className="flex gap-4">
                                        {/* Doctor Avatar */}
                                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-650 font-extrabold text-xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                                            {app.doctor?.user?.profileImage ? (
                                                <img src={app.doctor.user.profileImage} alt={app.doctor?.user?.name} className="w-full h-full object-cover" />
                                            ) : (
                                                app.doctor?.user?.name?.charAt(0).toUpperCase() || 'D'
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-extrabold text-slate-800 text-base">{app.doctor?.user?.name || 'Doctor'}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusClass(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <p className="text-blue-600 text-xs font-bold">{app.doctor?.specialty}</p>
                                            
                                            <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                                                <span className="flex items-center gap-1.5">
                                                    <FiCalendar size={14} className="text-blue-500" />
                                                    {new Date(app.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <FiClock size={14} className="text-blue-500" />
                                                    {app.time}
                                                </span>
                                            </div>

                                            {app.notes && (
                                                <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-3 mt-2 inline-block">
                                                    <span className="font-bold text-slate-650 block text-[10px] uppercase tracking-wider mb-1">My Notes:</span>
                                                    {app.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 self-end md:self-center">
                                        <Link 
                                            to={`/doctors/${app.doctor?._id}`}
                                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                                        >
                                            View Doctor
                                        </Link>
                                        
                                        {(app.status === 'pending' || app.status === 'confirmed') && (
                                            <button
                                                onClick={() => handleCancelAppointment(app._id)}
                                                disabled={cancellingId === app._id}
                                                className="px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold hover:bg-rose-100 transition cursor-pointer flex items-center gap-1.5"
                                            >
                                                <FiXCircle />
                                                {cancellingId === app._id ? 'Cancelling...' : 'Cancel'}
                                            </button>
                                        )}
                                        
                                        {app.status === 'completed' && (
                                            <Link
                                                to={`/doctors/${app.doctor?._id}`}
                                                className="px-4 py-2 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-xs font-semibold hover:bg-amber-100 transition flex items-center gap-1.5"
                                            >
                                                <FiStar className="fill-amber-500 text-amber-500" />
                                                Write Review
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default PatientDashboard