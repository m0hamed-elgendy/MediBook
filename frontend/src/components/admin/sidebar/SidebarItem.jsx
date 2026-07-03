import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const SidebarItem = ({ item }) => {

    const Icon = item.icon

    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                clsx(
                    'group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200',
                    isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                )
            }
        >
            {({ isActive }) => (
                <>
                    <div className="flex items-center gap-3">

                        <Icon
                            size={20}
                            strokeWidth={2}
                            className={clsx(
                                'transition-colors',
                                isActive
                                    ? 'text-white'
                                    : 'text-gray-500 group-hover:text-blue-600'
                            )}
                        />

                        <span className="font-medium">
                            {item.title}
                        </span>

                    </div>

                    {item.badge && (
                        <span
                            className={clsx(
                                'rounded-full px-2 py-0.5 text-xs font-semibold',
                                isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-red-100 text-red-600'
                            )}
                        >
                            {item.badge}
                        </span>
                    )}
                </>
            )}
        </NavLink>
    )
}

export default SidebarItem