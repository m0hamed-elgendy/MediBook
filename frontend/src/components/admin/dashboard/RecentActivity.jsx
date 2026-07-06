import React from 'react'
import Badge from '../../ui/Badge'
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi'

const RecentActivity = ({ appointments = [], isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="admin-chart-card animate-pulse">
                <h3 className="admin-chart-title mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="admin-chart-card">
            <h3 className="admin-chart-title mb-4">Recent Activity</h3>
            {appointments.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">No recent appointments activity.</p>
            ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800 animate-in fade-in duration-300">
                    {appointments.slice(0, 5).map((appt) => (
                        <div key={appt._id} className="py-3 flex items-center justify-between text-xs gap-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                    <FiUser size={14} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-850 dark:text-gray-200">
                                        {appt.patient?.name || 'Patient'} booked Dr. {appt.doctor?.user?.name || 'Doctor'}
                                    </span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                                        <FiCalendar size={11} /> {new Date(appt.date).toLocaleDateString()} at <FiClock size={11} /> {appt.time}
                                    </span>
                                </div>
                            </div>
                            <Badge variant={appt.status}>{appt.status}</Badge>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RecentActivity
