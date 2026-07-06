import React, { useState, useEffect } from 'react'
import doctorApplicationService from '../../services/doctor-application.service'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import { FiCheckCircle, FiXCircle, FiFileText, FiEye, FiAlertCircle } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'

const DoctorApplications = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Modals
    const [selectedApp, setSelectedApp] = useState(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    // Action dialogs
    const [appToApprove, setAppToApprove] = useState(null)
    const [appToReject, setAppToReject] = useState(null)
    const [rejectReason, setRejectReason] = useState('')
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [actionError, setActionError] = useState('')
    const { addToast } = useToast()

    const fetchApplications = async () => {
        try {
            setLoading(true)
            setError('')
            const res = await doctorApplicationService.getApplications()
            setApplications(res || [])
        } catch (err) {
            console.error(err)
            setError('Failed to fetch doctor applications. Please verify backend connectivity.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    const handleConfirmApprove = async () => {
        if (!appToApprove) return
        try {
            setIsActionLoading(true)
            setActionError('')
            await doctorApplicationService.approveApplication(appToApprove._id)
            addToast('Application approved successfully.', 'success')
            setAppToApprove(null)
            setIsDetailsOpen(false)
            fetchApplications()
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to approve application. Please try again.'
            setActionError(msg)
            addToast(msg, 'error')
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleConfirmReject = async () => {
        if (!appToReject) return
        if (!rejectReason.trim()) {
            addToast('Please provide a rejection reason.', 'error')
            return
        }
        try {
            setIsActionLoading(true)
            setActionError('')
            await doctorApplicationService.rejectApplication(appToReject._id, rejectReason)
            addToast('Application rejected.', 'success')
            setAppToReject(null)
            setRejectReason('')
            setIsDetailsOpen(false)
            fetchApplications()
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to reject application. Please try again.'
            setActionError(msg)
            addToast(msg, 'error')
        } finally {
            setIsActionLoading(false)
        }
    }

    const columns = [
        {
            header: 'Applicant',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <Avatar name={row.user?.name} size="sm" />
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{row.user?.name || 'Applicant'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{row.user?.phone || 'No phone listed'}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Specialization Applied',
            cell: (row) => (
                <Badge variant="info">
                    {row.specialty}
                </Badge>
            )
        },
        {
            header: 'Status',
            cell: (row) => {
                const statusVariants = {
                    pending: 'pending',
                    approved: 'success',
                    rejected: 'cancelled',
                }
                return (
                    <Badge variant={statusVariants[row.status] || 'neutral'}>
                        {row.status}
                    </Badge>
                )
            }
        },
        {
            header: 'Date Submitted',
            cell: (row) => new Date(row.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSelectedApp(row)
                            setIsDetailsOpen(true)
                        }}
                        className="!p-1.5"
                    >
                        <FiEye size={16} />
                    </Button>
                    {row.status === 'pending' && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setActionError(''); setAppToApprove(row) }}
                                className="!p-1.5 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-450 dark:hover:bg-emerald-950/20"
                                title="Approve Application"
                            >
                                <FiCheckCircle size={16} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setActionError(''); setAppToReject(row) }}
                                className="!p-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-450 dark:hover:bg-rose-950/20"
                                title="Reject Application"
                            >
                                <FiXCircle size={16} />
                            </Button>
                        </>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Doctor Applications</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Review and process verification applications from new doctors.
                </p>
            </div>

            {/* Data section — error replaces only the table area */}
            {error ? (
                <ErrorState
                    title="Failed to load applications"
                    message="Could not fetch doctor applications. The backend may be unavailable."
                    onRetry={fetchApplications}
                />
            ) : !loading && applications.length === 0 ? (
                <EmptyState
                    title="No applications registered"
                    description="No doctors have submitted verification requests yet."
                    icon={FiFileText}
                />
            ) : (
                <Table
                    columns={columns}
                    data={applications}
                    isLoading={loading}
                    emptyMessage="No applications found."
                />
            )}

            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Application Verification Profile"
                size="lg"
            >
                {selectedApp && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                            <Avatar name={selectedApp.user?.name} size="lg" />
                            <div>
                                <h3 className="text-base font-bold text-gray-900">{selectedApp.user?.name}</h3>
                                <p className="text-xs text-gray-500">Specialization: {selectedApp.specialty}</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant={selectedApp.status === 'pending' ? 'pending' : selectedApp.status === 'approved' ? 'success' : 'cancelled'}>
                                        Status: {selectedApp.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">License Image / Document</p>
                            {selectedApp.licenseImage ? (
                                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[350px] bg-slate-50 flex items-center justify-center">
                                    <img
                                        src={selectedApp.licenseImage}
                                        alt="Doctor License"
                                        className="max-h-[350px] object-contain w-auto hover:scale-105 transition-all duration-300"
                                    />
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 italic">No license document attached.</p>
                            )}
                        </div>

                        {selectedApp.status === 'rejected' && selectedApp.rejectionReason && (
                            <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-lg text-xs">
                                <p className="font-bold text-red-700 mb-1">Rejection Reason</p>
                                <p className="text-red-600 leading-normal">{selectedApp.rejectionReason}</p>
                            </div>
                        )}

                        {selectedApp.status === 'pending' && (
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => { setActionError(''); setAppToReject(selectedApp) }}
                                >
                                    Reject Application
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => { setActionError(''); setAppToApprove(selectedApp) }}
                                    icon={FiCheckCircle}
                                >
                                    Approve Profile
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={!!appToApprove}
                onClose={() => { setAppToApprove(null); setActionError('') }}
                title="Approve Professional Account"
                size="sm"
                footer={
                    <>
                        <Button variant="outline" size="sm" onClick={() => { setAppToApprove(null); setActionError('') }}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            isLoading={isActionLoading}
                            onClick={handleConfirmApprove}
                        >
                            Approve
                        </Button>
                    </>
                }
            >
                {appToApprove && (
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            Confirm credentials approval for <strong>{appToApprove.user?.name}</strong>.
                        </p>
                        <p className="text-xs text-gray-500">
                            Their role will be upgraded to Doctor and they will be allowed to start listing availability.
                        </p>
                        {actionError && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                                {actionError}
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={!!appToReject}
                onClose={() => {
                    setAppToReject(null)
                    setRejectReason('')
                    setActionError('')
                }}
                title="Reject Professional Account"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setAppToReject(null)
                                setRejectReason('')
                                setActionError('')
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            isLoading={isActionLoading}
                            onClick={handleConfirmReject}
                            disabled={!rejectReason.trim()}
                        >
                            Reject
                        </Button>
                    </>
                }
            >
                {appToReject && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-rose-600">
                            <FiAlertCircle size={18} />
                            <span className="text-sm font-semibold">Provide reason for rejection</span>
                        </div>
                        {actionError && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                                {actionError}
                            </div>
                        )}
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Type a message to explain the decision (required)..."
                            className="w-full min-h-[80px] p-3 text-xs rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default DoctorApplications
