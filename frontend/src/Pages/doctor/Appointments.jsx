import React, { useState, useEffect } from 'react'
import appointmentService from '../../services/appointment.service'
import { useToast } from '../../context/ToastContext'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Filters from '../../components/ui/Filters'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import { FiCalendar, FiCheck, FiX, FiCheckSquare, FiMessageSquare } from 'react-icons/fi'

const Appointments = () => {
    const { addToast } = useToast()
    const [appointments, setAppointments] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Filters
    const [status, setStatus] = useState('')

    // Diagnosis notes modal for completing appointments
    const [apptToComplete, setApptToComplete] = useState(null)
    const [notes, setNotes] = useState('')
    const [isActionLoading, setIsActionLoading] = useState(false)

    // Cancel modal
    const [apptToCancel, setApptToCancel] = useState(null)

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            setError('')
            const res = await appointmentService.getByDoctor({
                page: currentPage,
                limit: 10,
                status: status || undefined
            })
            setAppointments(res.data || [])
            setTotal(res.total || 0)
            setTotalPages(res.totalPages || 1)
        } catch (err) {
            console.error(err)
            setError('Failed to fetch doctor appointments.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [currentPage, status])

    const handleAccept = async (id) => {
        try {
            await appointmentService.updateStatus(id, 'confirmed')
            addToast('Appointment accepted and confirmed.')
            fetchAppointments()
        } catch (err) {
            console.error(err)
            addToast('Failed to accept appointment.', 'error')
        }
    }

    const handleCompleteSubmit = async () => {
        if (!apptToComplete) return
        try {
            setIsActionLoading(true)
            await appointmentService.updateStatus(apptToComplete._id, 'completed', notes)
            addToast('Appointment completed and saved.')
            setApptToComplete(null)
            setNotes('')
            fetchAppointments()
        } catch (err) {
            console.error(err)
            addToast('Failed to complete appointment.', 'error')
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleCancelSubmit = async () => {
        if (!apptToCancel) return
        try {
            setIsActionLoading(true)
            await appointmentService.updateStatus(apptToCancel._id, 'cancelled')
            addToast('Appointment cancelled.')
            setApptToCancel(null)
            fetchAppointments()
        } catch (err) {
            console.error(err)
            addToast('Failed to cancel appointment.', 'error')
        } finally {
            setIsActionLoading(false)
        }
    }

    const columns = [
        {
            header: 'Patient Name',
            cell: (row) => (
                <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{row.patient?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{row.patient?.email}</p>
                </div>
            )
        },
        {
            header: 'Date & Time',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-250">
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
                <div className="flex items-center justify-end gap-2">
                    {row.status === 'pending' && (
                        <>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleAccept(row._id)}
                                className="!py-1"
                            >
                                Accept
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setApptToCancel(row)}
                                className="!py-1 text-red-600 hover:bg-red-50"
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                    {row.status === 'confirmed' && (
                        <>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setApptToComplete(row)}
                                className="!py-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                icon={FiCheckSquare}
                            >
                                Complete
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setApptToCancel(row)}
                                className="!py-1 text-red-600 hover:bg-red-50"
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                    {row.status === 'completed' && row.notes && (
                        <span className="text-xs text-gray-400 italic">Completed with remarks</span>
                    )}
                    {row.status === 'cancelled' && (
                        <span className="text-xs text-gray-400 italic">Cancelled</span>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Manage Appointments</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Accept bookings, schedule completed patient consultations, or cancel sessions.
                </p>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl">
                <Filters
                    filters={[
                        {
                            key: 'status',
                            label: 'Status',
                            options: [
                                { value: 'pending', label: 'Pending Approval' },
                                { value: 'confirmed', label: 'Confirmed' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' }
                            ]
                        }
                    ]}
                    activeFilters={{ status }}
                    onFilterChange={(key, val) => {
                        setStatus(val)
                        setCurrentPage(1)
                    }}
                    onReset={() => {
                        setStatus('')
                        setCurrentPage(1)
                    }}
                />
            </div>

            {error ? (
                <ErrorState message={error} onRetry={fetchAppointments} />
            ) : !loading && appointments.length === 0 ? (
                <EmptyState
                    title="No appointments booked"
                    description="You don't have any bookings matching this status filter."
                    icon={FiCalendar}
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

            {/* Complete Consultation Modal */}
            <Modal
                isOpen={!!apptToComplete}
                onClose={() => {
                    setApptToComplete(null)
                    setNotes('')
                }}
                title="Complete Consultation Session"
                size="md"
                footer={
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setApptToComplete(null)
                                setNotes('')
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            isLoading={isActionLoading}
                            onClick={handleCompleteSubmit}
                        >
                            Submit & Mark Complete
                        </Button>
                    </>
                }
            >
                {apptToComplete && (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Patient: {apptToComplete.patient?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                Scheduled Time: {apptToComplete.time}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <FiMessageSquare /> Consultation Notes / Diagnosis (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Type diagnostics, prescriptions, or follow-up plans..."
                                className="w-full min-h-[100px] p-3 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Cancel Consultation Modal */}
            <Modal
                isOpen={!!apptToCancel}
                onClose={() => setApptToCancel(null)}
                title="Cancel Consultation Booking"
                size="sm"
                footer={
                    <>
                        <Button variant="outline" size="sm" onClick={() => setApptToCancel(null)}>
                            Go Back
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            isLoading={isActionLoading}
                            onClick={handleCancelSubmit}
                        >
                            Confirm Cancellation
                        </Button>
                    </>
                }
            >
                {apptToCancel && (
                    <div className="space-y-2">
                        <p className="text-sm text-gray-655 dark:text-gray-400">
                            Are you sure you want to cancel the appointment with <strong>{apptToCancel.patient?.name}</strong>?
                        </p>
                        <p className="text-xs text-rose-500">
                            The patient will receive a system alert of this cancelation.
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Appointments
