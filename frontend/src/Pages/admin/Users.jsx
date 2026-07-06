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
        setUserToSuspend(user)
    }

    const handleConfirmSuspend = async () => {
        if (!userToSuspend) return
        try {
            setIsActionLoading(true)
            await adminService.suspendUser(userToSuspend._id)
            setUserToSuspend(null)
            fetchUsers()
        } catch (err) {
            console.error(err)
            alert('Failed to suspend user.')
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
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Users</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage patient, doctor, and admin system accounts.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl">
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

            {/* Error / Empty / Data view */}
            {error ? (
                <ErrorState message={error} onRetry={fetchUsers} />
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

            {/* Details Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="User Details"
                size="md"
            >
                {selectedUser && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                            <Avatar src={selectedUser.profileImage} name={selectedUser.name} size="lg" />
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{selectedUser.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
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
                                <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">User ID</p>
                                <p className="text-gray-850 dark:text-gray-200">{selectedUser._id}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-gray-850 dark:text-gray-200">{selectedUser.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Registration Date</p>
                                <p className="text-gray-850 dark:text-gray-200">
                                    {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Last Update</p>
                                <p className="text-gray-850 dark:text-gray-200">
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

            {/* Suspend Confirmation Modal */}
            <Modal
                isOpen={!!userToSuspend}
                onClose={() => setUserToSuspend(null)}
                title="Suspend User Account"
                size="sm"
                footer={
                    <>
                        <Button variant="outline" size="sm" onClick={() => setUserToSuspend(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            isLoading={isActionLoading}
                            onClick={handleConfirmSuspend}
                        >
                            Suspend
                        </Button>
                    </>
                }
            >
                {userToSuspend && (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Are you sure you want to suspend <strong>{userToSuspend.name}</strong>?
                        </p>
                        <p className="text-xs text-red-500 font-medium">
                            The user will no longer be able to log in or book appointments.
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Users
