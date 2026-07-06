import React, { useState, useEffect, useRef } from 'react'
import doctorService from '../../services/doctor.service'
import adminService from '../../services/admin.service'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Avatar from '../../components/ui/Avatar'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import { Stethoscope, Star, Search, MoreHorizontal, X } from 'lucide-react'
import { FiUser, FiSliders } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'
import ConfirmModal from '../../components/ui/ConfirmModal'

const SPECIALTY_OPTIONS = [
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'General Medicine', label: 'General Medicine' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'ENT', label: 'ENT' },
  { value: 'Ophthalmology', label: 'Ophthalmology' },
  { value: 'Psychiatry', label: 'Psychiatry' },
  { value: 'Gynecology', label: 'Gynecology' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const ActionsDropdown = ({ doctor, onView, onDeactivate }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = doctor.user?.isActive !== false

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5 animate-in fade-in zoom-in-95 origin-top-right">
          <button
            onClick={() => { setOpen(false); onView(doctor) }}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiUser size={14} className="text-gray-400" />
            View Profile
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiSliders size={14} className="text-gray-400" />
            Edit
          </button>
          <div className="h-px bg-gray-100 my-1 mx-3" />
          <button
            onClick={() => { setOpen(false); onDeactivate(doctor) }}
            className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm transition-colors ${isActive ? 'text-red-600 hover:bg-red-50' : 'text-gray-400 cursor-not-allowed'}`}
            disabled={!isActive}
          >
            <X size={14} />
            {isActive ? 'Deactivate' : 'Deactivated'}
          </button>
        </div>
      )}
    </div>
  )
}

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [status, setStatus] = useState('')

  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [doctorToSuspend, setDoctorToSuspend] = useState(null)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const { addToast } = useToast()

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await doctorService.getDoctors({
        page: currentPage,
        limit: 10,
        search: search || undefined,
        specialty: specialty || undefined,
      })
      setDoctors(res.data || [])
      setTotal(res.total || 0)
      setTotalPages(res.totalPages || 1)
    } catch (err) {
      console.error(err)
      setError('Failed to load doctors list.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [currentPage, specialty])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchDoctors()
  }

  const handleReset = () => {
    setSearch('')
    setSpecialty('')
    setStatus('')
    setCurrentPage(1)
  }

  const handleSuspendClick = (doc) => {
    setActionError('')
    setDoctorToSuspend(doc)
  }

  const handleConfirmSuspend = async () => {
    if (!doctorToSuspend) return
    try {
      setIsActionLoading(true)
      setActionError('')
      await adminService.suspendUser(doctorToSuspend.user?._id)
      addToast('Doctor deactivated successfully.', 'success')
      setDoctorToSuspend(null)
      fetchDoctors()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to deactivate doctor. Please try again.'
      setActionError(msg)
      addToast(msg, 'error')
    } finally {
      setIsActionLoading(false)
    }
  }

  const renderStars = (rating) => {
    const num = rating || 0
    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={13}
              className={i <= Math.round(num) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
              strokeWidth={0}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-800 ml-1.5">
          {num > 0 ? num.toFixed(1) : '—'}
        </span>
        <span className="text-xs text-gray-400 ml-0.5">
          ({selectedDoctor?.reviewsCount || 0} reviews)
        </span>
      </div>
    )
  }

  const hasActiveFilters = search || specialty || status

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Doctors</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage registered doctors, view profiles, and control access.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-4 flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctors..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); setCurrentPage(1) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Specialty Select */}
          <select
            value={specialty}
            onChange={(e) => { setSpecialty(e.target.value); setCurrentPage(1) }}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer min-w-[140px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              backgroundSize: '14px 10px',
              paddingRight: '32px',
            }}
          >
            <option value="">All Specialties</option>
            {SPECIALTY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setCurrentPage(1) }}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer min-w-[130px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              backgroundSize: '14px 10px',
              paddingRight: '32px',
            }}
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Error / Empty / Data */}
      {error ? (
        <ErrorState message={error} onRetry={fetchDoctors} />
      ) : !loading && doctors.length === 0 ? (
        <EmptyState
          title="No doctors match criteria"
          description="Try searching for another specialty or name."
          icon={Stethoscope}
          actionLabel="Reset Filters"
          onAction={handleReset}
        />
      ) : (
        <div className="space-y-4">
          {/* Table */}
          <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Doctor</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Specialty</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Rating</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Consultation Fee</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, rIdx) => (
                    <tr key={rIdx} className="border-b border-gray-100 last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                            <div className="h-2.5 w-36 bg-gray-100 rounded animate-pulse" />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><div className="h-5 w-24 bg-gray-100 rounded-full animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="h-4 w-20 bg-gray-100 rounded animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="h-4 w-16 bg-gray-100 rounded animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse ml-auto" /></td>
                    </tr>
                  ))
                ) : doctors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                      No doctors found.
                    </td>
                  </tr>
                ) : (
                  doctors.map((row, rIdx) => {
                    const isActive = row.user?.isActive !== false
                    return (
                      <tr
                        key={row._id || rIdx}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors duration-150"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar src={row.user?.profileImage} name={row.user?.name} size="sm" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">Dr. {row.user?.name}</p>
                              <p className="text-xs text-gray-500">{row.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-700">
                            {row.specialty}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  className={i <= Math.round(row.averageRating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                                  strokeWidth={0}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-800 ml-1.5">
                              {row.averageRating ? row.averageRating.toFixed(1) : '—'}
                            </span>
                            <span className="text-xs text-gray-400 ml-0.5">
                              ({row.reviewsCount || 0})
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {row.consultationPrice || 0} EGP
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              isActive
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-gray-50 border-gray-200 text-gray-500'
                            }`}
                          >
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <ActionsDropdown
                            doctor={row}
                            onView={(doc) => { setSelectedDoctor(doc); setIsDetailsOpen(true) }}
                            onDeactivate={handleSuspendClick}
                          />
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

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
        title="Doctor Profile"
        size="md"
      >
        {selectedDoctor && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <Avatar src={selectedDoctor.user?.profileImage} name={selectedDoctor.user?.name} size="lg" />
              <div>
                <h3 className="text-base font-bold text-gray-900">Dr. {selectedDoctor.user?.name}</h3>
                <p className="text-xs text-gray-500">{selectedDoctor.user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-700">
                    {selectedDoctor.specialty}
                  </span>
                  {renderStars(selectedDoctor.averageRating)}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Biography</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                  &ldquo;{selectedDoctor.bio || 'No bio listed.'}&rdquo;
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Consultation Price</p>
                  <p className="text-gray-900 font-medium">{selectedDoctor.consultationPrice || 0} EGP</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-gray-900 font-medium">{selectedDoctor.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-gray-900 font-medium">{selectedDoctor.address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Rating</p>
                  <p className="text-gray-900 font-medium">
                    {selectedDoctor.averageRating || 0} / 5 ({selectedDoctor.reviewsCount || 0} reviews)
                  </p>
                </div>
              </div>
              {selectedDoctor.services?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Services</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedDoctor.services.map((srv, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedDoctor.symptoms?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Symptoms Treated</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedDoctor.symptoms.map((sym, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Suspend Confirmation Modal */}
      <ConfirmModal
        isOpen={!!doctorToSuspend}
        onClose={() => { setDoctorToSuspend(null); setActionError('') }}
        onConfirm={handleConfirmSuspend}
        title="Deactivate Doctor"
        message={doctorToSuspend ? `Are you sure you want to deactivate Dr. ${doctorToSuspend.user?.name}?` : ''}
        detail="The doctor will lose access to the platform until reactivated."
        confirmLabel="Deactivate"
        isLoading={isActionLoading}
      >
        {actionError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
            {actionError}
          </div>
        )}
      </ConfirmModal>
    </div>
  )
}

export default Doctors
