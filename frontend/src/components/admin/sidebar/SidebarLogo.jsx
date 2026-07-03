import { HeartPulse } from 'lucide-react'
import { Link } from 'react-router-dom'

const SidebarLogo = () => {
    return (
        <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-6 py-8 border-b border-gray-100"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                <HeartPulse size={24} />
            </div>

            <div>
                <h1 className="text-xl font-bold text-gray-900">
                    MediBook
                </h1>

                <p className="text-sm text-gray-500">
                    Healthcare Admin
                </p>
            </div>
        </Link>
    )
}

export default SidebarLogo