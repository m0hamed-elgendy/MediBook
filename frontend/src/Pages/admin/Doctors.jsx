import React, { useState, useEffect } from 'react'
import doctorService from '../../services/doctor.service'
import adminService from '../../services/admin.service'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import SearchInput from '../../components/ui/SearchInput'
import Filters from '../../components/ui/Filters'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import { Stethoscope, Star } from 'lucide-react'
import { FiEye, FiUserMinus } from 'react-icons/fi'

const Doctors = () => {
    const [doctors, setDoctors] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Filters
    const [search, setSearch] = useState('')
    const [specialty, setSpecialty] = useState('')

    // Details Modal
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    // Action Confirmation Modal
    const [doctorToSuspend, setDoctorToSuspend] = useState(null)
    const [isActionLoading, setIsActionLoading] = useState(false)

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
        setCurrentPage(1)
    }

    const handleSuspendClick = (doc) => {
        setDoctorToSuspend(doc)
    }

    const handleConfirmSuspend = async () => {
        if (!doctorToSuspend) return
        try {
            setIsActionLoading(true)
            // Suspend the underlying user account
            await adminService.suspendUser(doctorToSuspend.user?._id)
            setDoctorToSuspend(null)
            fetchDoctors()
        } catch (err) {
            console.error(err)
            alert('Failed to suspend doctor.')
        } finally {
            setIsActionLoading(false)
        }
    }

    const columns = [
        {
            header: 'Doctor',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <Avatar src={row.user?.profileImage} name={row.user?.name} size="sm" />
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Dr. {row.user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{row.user?.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Specialty',
            cell: (row) => (
                <Badge variant="primary">
                    {row.specialty}
                </Badge>
            )
        },
        {
            header: 'Rating',
            cell: (row) => (
                <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {row.averageRating ? row.averageRating.toFixed(1) : '0.0'}
                    </span>
                    <span className="text-xs text-gray-400">
                        ({row.reviewsCount || 0})
                    </span>
                </div>
            )
        },
        {
            header: 'Consultation Fee',
            cell: (row) => (
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                    ${row.consultationPrice}
                </span>
            )
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
                            setSelectedDoctor(row)
                            setIsDetailsOpen(true)
                        }}
                        className="!p-1.5"
                    >
                        <FiEye size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSuspendClick(row)}
                        className="!p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                        title="Deactivate Doctor"
                    >
                        <FiUserMinus size={16} />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Doctors</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    View active medical professionals and configure deactivations.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl">
                <form onSubmit={handleSearchSubmit} className="w-full md:max-w-xs flex gap-2">
                    <SearchInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search specialty or bio..."
                        onClear={() => {
                            setSearch('')
                            setCurrentPage(1)
                        }}
                    />
                    <Button type="submit" variant="secondary" size="sm">Search</Button>
                </form>

                <Filters
                    filters={[
                        {
                            key: 'specialty',
                            label: 'Specialty',
                            options: [
                                { value: 'Cardiology', label: 'Cardiology' },
                                { value: 'Dermatology', label: 'Dermatology' },
                                { value: 'Pediatrics', label: 'Pediatrics' },
                                { value: 'General Medicine', label: 'General Medicine' }
                            ]
                        }
                    ]}
                    activeFilters={{ specialty }}
                    onFilterChange={(key, val) => {
                        if (key === 'specialty') setSpecialty(val)
                        setCurrentPage(1)
                    }}
                    onReset={handleReset}
                />
            </div>

            {/* Content view */}
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
                    <Table
                        columns={columns}
                        data={doctors}
                        isLoading={loading}
                        emptyMessage="No doctors found."
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
                title="Doctor Professional Profile"
                size="md"
            >
                {selectedDoctor && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                            <Avatar src={selectedDoctor.user?.profileImage} name={selectedDoctor.user?.name} size="lg" />
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Dr. {selectedDoctor.user?.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedDoctor.user?.email}</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="primary">
                                        {selectedDoctor.specialty}
                                    </Badge>
                                    <Badge variant="success">
                                        Active
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-xs leading-normal">
                            <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Biography</p>
                                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-850 p-3 rounded-lg border border-gray-100 dark:border-gray-800 italic">
                                    "{selectedDoctor.bio || 'No bio listed.'}"
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Consultation Price</p>
                                    <p className="text-gray-900 dark:text-gray-250 font-medium">${selectedDoctor.consultationPrice}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                                    <p className="text-gray-900 dark:text-gray-250 font-medium">{selectedDoctor.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                                    <p className="text-gray-900 dark:text-gray-250 font-medium">{selectedDoctor.address}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Rating</p>
                                    <p className="text-gray-900 dark:text-gray-250 font-medium">
                                        {selectedDoctor.averageRating || 0} / 5 ({selectedDoctor.reviewsCount || 0} reviews)
                                    </p>
                                </div>
                            </div>
                            {selectedDoctor.services?.length > 0 && (
                                <div>
                                    <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Services</p>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {selectedDoctor.services.map((srv, i) => (
                                            <Badge key={i} variant="neutral">{srv}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {selectedDoctor.symptoms?.length > 0 && (
                                <div>
                                    <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Symptoms Treated</p>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {selectedDoctor.symptoms.map((sym, i) => (
                                            <Badge key={i} variant="neutral">{sym}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Suspend Confirmation Modal */}
            <Modal
                isOpen={!!doctorToSuspend}
                onClose={() => setDoctorToSuspend(null)}
                title="Deactivate Doctor Account"
                size="sm"
                footer={
                    <>
                        <Button variant="outline" size="sm" onClick={() => setDoctorToSuspend(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            isLoading={isActionLoading}
                            onClick={handleConfirmSuspend}
                        >
                            Confirm Deactivation
                        </Button>
                    </>
                }
            >
                {doctorToSuspend && (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-450">
                            Are you sure you want to deactivate the account of <strong>Dr. {doctorToSuspend.user?.name}</strong>?
                        </p>
                        <p className="text-xs text-red-500 font-medium">
                            They will immediately lose access to the system.
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Doctors
