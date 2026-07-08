import React, { useState, useEffect, useCallback, useMemo } from 'react'
import doctorApplicationService from '../../services/doctor-application.service'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import { FiCheckCircle, FiXCircle, FiFileText, FiEye, FiAlertCircle } from 'react-icons/fi'
import Textarea from '../../components/ui/Textarea'
import { useToast } from '../../context/ToastContext'
import ConfirmModal from '../../components/ui/ConfirmModal'

const PAGE_SIZE = 10

const statusVariants = {
  pending: 'pending',
  approved: 'success',
  rejected: 'cancelled',
}

const statusLabel = (status) => {
  switch (status) {
    case 'pending': return 'Pending'
    case 'approved': return 'Approved'
    case 'rejected': return 'Rejected'
    default: return status
  }
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const DoctorApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedApp, setSelectedApp] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [appToApprove, setAppToApprove] = useState(null)
  const [appToReject, setAppToReject] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const { addToast } = useToast()

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await doctorApplicationService.getApplications()
      setApplications(Array.isArray(res) ? res : [])
      setCurrentPage(1)
    } catch (err) {
      console.error(err)
      setError('Unable to load applications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(applications.length / PAGE_SIZE)),
    [applications],
  )

  const paginatedApps = useMemo(
    () => applications.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [applications, currentPage],
  )

  const handleConfirmApprove = useCallback(async () => {
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
  }, [appToApprove, addToast, fetchApplications])

  const handleConfirmReject = useCallback(async () => {
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
  }, [appToReject, rejectReason, addToast, fetchApplications])

  const handleViewDetails = useCallback((app) => {
    setSelectedApp(app)
    setIsDetailsOpen(true)
  }, [])

  const columns = useMemo(() => [
    {
      header: 'Doctor',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.user?.name} size="sm" />
          <div>
            <p className="font-semibold text-gray-900">{row.user?.name || 'Applicant'}</p>
            {row.user?.phone && <p className="text-xs text-gray-500">{row.user.phone}</p>}
          </div>
        </div>
      ),
    },
    {
      header: 'Specialty',
      cell: (row) => <Badge variant="info">{row.specialty}</Badge>,
    },
    {
      header: 'Submitted',
      cell: (row) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={statusVariants[row.status] || 'neutral'}>
          {statusLabel(row.status)}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row)}
            className="!p-1.5"
            title="View Details"
          >
            <FiEye size={16} />
          </Button>
          {row.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setActionError(''); setAppToApprove(row) }}
                className="!px-2.5 !py-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 border border-transparent hover:border-emerald-200"
              >
                <FiCheckCircle size={14} className="mr-1" />
                Approve
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setActionError(''); setAppToReject(row) }}
                className="!px-2.5 !py-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-transparent hover:border-rose-200"
              >
                <FiXCircle size={14} className="mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ], [handleViewDetails])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Doctor Applications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and process verification applications from new doctors.
        </p>
      </div>

      {error ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500 mb-3">
            <FiAlertCircle size={20} />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Unable to load applications</h3>
          <p className="text-xs text-gray-500 mb-4">Please try again.</p>
          <Button variant="outline" size="sm" onClick={fetchApplications}>Retry</Button>
        </div>
      ) : !loading && applications.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No doctor applications yet."
          description="Applications submitted by doctors will appear here."
        />
      ) : (
        <>
          <div className="hidden lg:block">
            <Table
              columns={columns}
              data={paginatedApps}
              isLoading={loading}
              emptyMessage="No applications found."
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          <div className="lg:hidden space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                </div>
              ))
            ) : (
              paginatedApps.map((app) => (
                <div key={app._id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={app.user?.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {app.user?.name || 'Applicant'}
                      </p>
                      {app.user?.phone && (
                        <p className="text-xs text-gray-500 truncate">{app.user.phone}</p>
                      )}
                    </div>
                    <Badge variant={statusVariants[app.status] || 'neutral'}>
                      {statusLabel(app.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{app.specialty}</Badge>
                    <span className="text-xs text-gray-400">{formatDate(app.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(app)}
                      className="flex-1"
                    >
                      <FiEye size={14} className="mr-1.5" />
                      View Details
                    </Button>
                    {app.status === 'pending' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => { setActionError(''); setAppToApprove(app) }}
                          className="flex-1 !bg-emerald-600 hover:!bg-emerald-700"
                        >
                          <FiCheckCircle size={14} className="mr-1.5" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setActionError(''); setAppToReject(app) }}
                          className="flex-1 !border-rose-300 !text-rose-600 hover:!bg-rose-50"
                        >
                          <FiXCircle size={14} className="mr-1.5" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </>
      )}

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Application Details"
        size="lg"
      >
        {selectedApp && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <Avatar name={selectedApp.user?.name} size="lg" />
              <div>
                <h3 className="text-base font-bold text-gray-900">{selectedApp.user?.name}</h3>
                {selectedApp.user?.phone && (
                  <p className="text-xs text-gray-500">{selectedApp.user.phone}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="info">{selectedApp.specialty}</Badge>
                  <Badge variant={statusVariants[selectedApp.status] || 'neutral'}>
                    {statusLabel(selectedApp.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">License Document</p>
              {selectedApp.licenseImage ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[350px] bg-gray-50 flex items-center justify-center">
                  <img
                    src={selectedApp.licenseImage}
                    alt="Medical License"
                    className="max-h-[350px] object-contain w-auto hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No license document attached.</p>
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
                  variant="outline"
                  size="sm"
                  onClick={() => { setActionError(''); setAppToReject(selectedApp) }}
                  className="!border-rose-300 !text-rose-600 hover:!bg-rose-50"
                >
                  <FiXCircle size={14} className="mr-1.5" />
                  Reject Application
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => { setActionError(''); setAppToApprove(selectedApp) }}
                  className="!bg-emerald-600 hover:!bg-emerald-700"
                  icon={FiCheckCircle}
                >
                  Approve Application
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!appToApprove}
        onClose={() => { setAppToApprove(null); setActionError('') }}
        onConfirm={handleConfirmApprove}
        title="Approve Application"
        message={appToApprove ? `Confirm credentials approval for ${appToApprove.user?.name}.` : ''}
        detail="Their role will be upgraded to Doctor and they will be allowed to start listing availability."
        confirmLabel="Approve"
        confirmVariant="primary"
        isLoading={isActionLoading}
      >
        {actionError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
            {actionError}
          </div>
        )}
      </ConfirmModal>

      <ConfirmModal
        isOpen={!!appToReject}
        onClose={() => {
          setAppToReject(null)
          setRejectReason('')
          setActionError('')
        }}
        onConfirm={handleConfirmReject}
        title="Reject Application"
        message="Provide a reason for rejection."
        confirmLabel="Reject"
        isLoading={isActionLoading}
        confirmDisabled={!rejectReason.trim()}
      >
        {actionError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 mb-3">
            {actionError}
          </div>
        )}
        <Textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Type a message to explain the decision (required)..."
          rows={4}
        />
      </ConfirmModal>
    </div>
  )
}

export default DoctorApplications
