import { NavLink } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Sidebar = ({
  items = [],
  logo,
  footer,
  collapsed,
  onToggle,
  className = '',
}) => {
  return (
    <aside
      className={`flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} ${className}`}
    >
      {/* Logo */}
      {logo && (
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-6 border-b border-gray-100 dark:border-gray-800`}>
          {!collapsed && logo}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
            </button>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.5} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      {footer && (
        <div className={`border-t border-gray-100 dark:border-gray-800 p-4 ${collapsed ? 'text-center' : ''}`}>
          {footer}
        </div>
      )}
    </aside>
  )
}

export default Sidebar
