import React, { useState, useEffect } from 'react'
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
import { FiUsers, FiEye, FiUserMinus, FiCheckCircle } from 'react-icons/fi'
import { useToast } from '../../context/ToastContext'
import ConfirmModal from '../../components/ui/ConfirmModal'

const Users = () => {
    const [users, setUsers] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Filters
    const [search, setSearch] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('') // 'active', 'suspended'

    // Details Modal
    const [selectedUser, setSelectedUser] = useState(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    // Action Confirmation Modal
    const [userToSuspend, setUserToSuspend] = useState(null)
    const [isActionLoading, setIsActionLoading] = useState(false)
    const [actionError, setActionError] = useState('')
    const { addToast } = useToast()

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError('')
            
            // map active status to backend filter
            let isActiveFilter;
            if (status === 'active') isActiveFilter = true
            if (status === 'suspended') isActiveFilter = false

            const res = await adminService.getUsers({
                page: currentPage,
                limit: 10,
                role: role || undefined,
                isActive: isActiveFilter,
                search: search || undefined,
            })
            setUsers(res.data || [])
            setTotal(res.total || 0)
            setTotalPages(res.totalPages || 1)
        } catch (err) {
            console.error(err)
            setError('Failed to load users. Please verify backend connection.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [currentPage, role, status])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        setCurrentPage(1)
        fetchUsers()
    }

    const handleReset = () => {
        setSearch('')
        setRole('')
        setStatus('')
        setCurrentPage(1)
    }

    const handleSuspendClick = (user) => {
        setActionError('')
        setUserToSuspend(user)
    }

    const handleConfirmSuspend = async () => {
        if (!userToSuspend) return
        try {
            setIsActionLoading(true)
            setActionError('')
            await adminService.suspendUser(userToSuspend._id)
            addToast('User suspended successfully.', 'success')
            setUserToSuspend(null)
            fetchUsers()
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to suspend user. Please try again.'
            setActionError(msg)
            addToast(msg, 'error')
        } finally {
            setIsActionLoading(false)
        }
    }

    const columns = [
        {
            header: 'User',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <Avatar src={row.profileImage} name={row.name} size="sm" />
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{row.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Role',
            cell: (row) => (
                <Badge variant={row.role === 'admin' ? 'danger' : row.role === 'doctor' ? 'primary' : 'neutral'}>
                    {row.role}
                </Badge>
            )
        },
        {
            header: 'Status',
            cell: (row) => (
                <Badge variant={row.isActive ? 'success' : 'cancelled'}>
                    {row.isActive ? 'Active' : 'Suspended'}
                </Badge>
            )
        },
        {
            header: 'Created At',
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
                            setSelectedUser(row)
                            setIsDetailsOpen(true)
                        }}
                        className="!p-1.5"
                    >
                        <FiEye size={16} />
                    </Button>
                    {row.isActive && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuspendClick(row)}
                            className="!p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                            <FiUserMinus size={16} />
                        </Button>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Users</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage patient, doctor, and admin system accounts.
                </p>
            </div>

            {/* Toolbar — always visible */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="w-full md:max-w-xs flex gap-2">
                    <SearchInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name or email..."
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
                            key: 'role',
                            label: 'Role',
                            options: [
                                { value: 'patient', label: 'Patient' },
                                { value: 'doctor', label: 'Doctor' },
                                { value: 'admin', label: 'Admin' }
                            ]
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            options: [
                                { value: 'active', label: 'Active' },
                                { value: 'suspended', label: 'Suspended' }
                            ]
                        }
                    ]}
                    activeFilters={{ role, status }}
                    onFilterChange={(key, val) => {
                        if (key === 'role') setRole(val)
                        if (key === 'status') setStatus(val)
                        setCurrentPage(1)
                    }}
                    onReset={handleReset}
                />
            </div>

            {/* Data section — error replaces only the table area */}
            {error ? (
                <ErrorState
                    title="Failed to load users"
                    message="Could not fetch user data. The backend may be unavailable."
                    onRetry={fetchUsers}
                />
            ) : !loading && users.length === 0 ? (
                <EmptyState
                    title="No users match the criteria"
                    description="Try modifying search query or resetting filters."
                    icon={FiUsers}
                    actionLabel="Reset Filters"
                    onAction={handleReset}
                />
            ) : (
                <div className="space-y-4">
                    <Table
                        columns={columns}
                        data={users}
                        isLoading={loading}
                        emptyMessage="No users found."
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}

            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="User Details"
                size="md"
            >
                {selectedUser && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                            <Avatar src={selectedUser.profileImage} name={selectedUser.name} size="lg" />
                            <div>
                                <h3 className="text-base font-bold text-gray-900">{selectedUser.name}</h3>
                                <p className="text-xs text-gray-500">{selectedUser.email}</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant={selectedUser.role === 'admin' ? 'danger' : selectedUser.role === 'doctor' ? 'primary' : 'neutral'}>
                                        {selectedUser.role}
                                    </Badge>
                                    <Badge variant={selectedUser.isActive ? 'success' : 'cancelled'}>
                                        {selectedUser.isActive ? 'Active' : 'Suspended'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">User ID</p>
                                <p className="text-gray-800 font-medium">{selectedUser._id}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-gray-800 font-medium">{selectedUser.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Registration Date</p>
                                <p className="text-gray-800 font-medium">
                                    {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">Last Update</p>
                                <p className="text-gray-800 font-medium">
                                    {new Date(selectedUser.updatedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <ConfirmModal
                isOpen={!!userToSuspend}
                onClose={() => { setUserToSuspend(null); setActionError('') }}
                onConfirm={handleConfirmSuspend}
                title="Suspend User"
                message={userToSuspend ? `Are you sure you want to suspend ${userToSuspend.name}?` : ''}
                detail="The user will no longer be able to log in or book appointments."
                confirmLabel="Suspend"
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

export default Users
