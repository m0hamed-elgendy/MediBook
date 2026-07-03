import { ChevronDown } from 'lucide-react'

const SidebarFooter = ({ user, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full border-t border-gray-100 p-5 hover:bg-gray-50 transition"
        >
            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            user?.name?.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div className="text-left">

                        <h4 className="font-semibold text-gray-900">
                            {user?.name}
                        </h4>

                        <p className="text-sm text-gray-500 truncate max-w-[150px]">
                            {user?.email}
                        </p>

                    </div>

                </div>

                <ChevronDown
                    size={18}
                    className="text-gray-500"
                />

            </div>
        </button>
    )
}

export default SidebarFooter