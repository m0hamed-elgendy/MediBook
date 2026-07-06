import React, { useState, useEffect } from 'react'
import appointmentService from '../../services/appointment.service'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import SearchInput from '../../components/ui/SearchInput'
import Filters from '../../components/ui/Filters'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import { FiCalendar, FiClock, FiEye, FiUser, FiActivity } from 'react-icons/fi'

const Appointments = () => {
    const [appointments, setAppointments] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Filters
    const [status, setStatus] = useState('')
    const [date, setDate] = useState('')

    // Details Modal
    const [selectedAppt, setSelectedAppt] = useState(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            setError('')
            const res = await appointmentService.getAll({
                page: currentPage,
                limit: 10,
                status: status || undefined,
                date: date || undefined,
            })
            setAppointments(res.data || [])
            setTotal(res.total || 0)
            setTotalPages(res.totalPages || 1)
        } catch (err) {
            console.error(err)
            setError('Failed to fetch system appointments. Please verify NestJS connection.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [currentPage, status, date])

    const handleReset = () => {
        setStatus('')
        setDate('')
        setCurrentPage(1)
    }

    const columns = [
        {
            header: 'Patient',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {row.patient?.name || 'N/A'}
                    </span>
                </div>
            )
        },
        {
            header: 'Doctor',
            cell: (row) => (
                <span className="text-gray-700 dark:text-gray-300">
                    Dr. {row.doctor?.user?.name || 'N/A'}
                </span>
            )
        },
        {
            header: 'Date & Time',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-gray-500">{row.time}</span>
                </div>
            )
        },
        {
            header: 'Status',
            cell: (row) => (
                <Badge variant={row.status}>
                    {row.status}
                </Badge>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSelectedAppt(row)
                            setIsDetailsOpen(true)
                        }}
                        className="!p-1.5"
                    >
                        <FiEye size={16} />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Appointments</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Monitor, inspect, and analyze all booked patient sessions.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl">
                <div className="flex flex-col gap-1 w-full md:max-w-xs">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date Filter</span>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
                    />
                </div>

                <Filters
                    filters={[
                        {
                            key: 'status',
                            label: 'Status',
                            options: [
                                { value: 'pending', label: 'Pending' },
                                { value: 'confirmed', label: 'Confirmed' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' }
                            ]
                        }
                    ]}
                    activeFilters={{ status }}
                    onFilterChange={(key, val) => {
                        if (key === 'status') setStatus(val)
                        setCurrentPage(1)
                    }}
                    onReset={handleReset}
                />
            </div>

            {/* Content view */}
            {error ? (
                <ErrorState message={error} onRetry={fetchAppointments} />
            ) : !loading && appointments.length === 0 ? (
                <EmptyState
                    title="No appointments registered"
                    description="No records match the requested filters."
                    icon={FiCalendar}
                    actionLabel="Reset Filters"
                    onAction={handleReset}
                />
            ) : (
                <div className="space-y-4">
                    <Table
                        columns={columns}
                        data={appointments}
                        isLoading={loading}
                        emptyMessage="No appointments found."
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}

            {/* Details Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Appointment Details"
                size="md"
            >
                {selectedAppt && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                            <div className="flex items-center gap-2">
                                <FiCalendar className="text-blue-500" />
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {new Date(selectedAppt.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <Badge variant={selectedAppt.status}>
                                {selectedAppt.status}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs leading-normal">
                            <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Patient Details</p>
                                <p className="text-gray-900 dark:text-gray-200 font-medium">{selectedAppt.patient?.name || 'N/A'}</p>
                                <p className="text-gray-500">{selectedAppt.patient?.email}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Doctor Details</p>
                                <p className="text-gray-900 dark:text-gray-200 font-medium">Dr. {selectedAppt.doctor?.user?.name || 'N/A'}</p>
                                <p className="text-gray-500">{selectedAppt.doctor?.specialty}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Scheduled Time</p>
                                <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                    <FiClock />
                                    <span>{selectedAppt.time}</span>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Consultation Price</p>
                                <p className="text-gray-900 dark:text-gray-200 font-medium">${selectedAppt.doctor?.consultationPrice || 'N/A'}</p>
                            </div>
                        </div>

                        {selectedAppt.notes && (
                            <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-lg text-xs">
                                <p className="font-semibold text-gray-500 mb-1">Diagnosis Notes / Remarks</p>
                                <p className="text-gray-700 dark:text-gray-300">{selectedAppt.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Appointments
