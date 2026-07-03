import { Bell, Search } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'

const AdminHeader = () => {
    const { user } = useAuth()

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'A'

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">

            {/* Search */}
            <div className="relative w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition" aria-label="Notifications">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User avatar */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                        {initials}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                        {user?.name || 'Admin'}
                    </span>
                </div>

            </div>

        </header>
    )
}

export default AdminHeader
