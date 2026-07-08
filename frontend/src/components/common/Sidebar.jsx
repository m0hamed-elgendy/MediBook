import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { LogOut, HeartPulse } from 'lucide-react'
import { useSidebar } from '../../context/SidebarContext'

const Sidebar = ({ navigationItems = [], user = {}, role = 'patient', onLogout }) => {
    const { collapsed, isMobile, mobileOpen, closeMobile } = useSidebar()
    const [showLogoutTooltip, setShowLogoutTooltip] = useState(false)
    const [activeTooltipIndex, setActiveTooltipIndex] = useState(null)

    // Close mobile drawer on Escape key press
    useEffect(() => {
        if (!mobileOpen) return
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeMobile()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [mobileOpen, closeMobile])

    const renderLogo = (isCollapsed) => {
        const dashboardPath = `/${role}/dashboard`
        const subtitle = role === 'admin' 
            ? 'Healthcare Admin' 
            : role === 'doctor' 
            ? 'Healthcare Doctor' 
            : 'Patient Portal'

        return (
            <Link to={dashboardPath} className="sidebar__logo">
                <div className="sidebar__logo-icon">
                    <HeartPulse size={24} />
                </div>
                <div
                    className="sidebar__logo-text-wrap"
                    style={{
                        opacity: isCollapsed ? 0 : 1,
                        width: isCollapsed ? 0 : 'auto',
                        overflow: 'hidden',
                        transition: 'opacity 0.2s ease, width 0.3s ease',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <h1 className="sidebar__logo-title">MediBook</h1>
                    <p className="sidebar__logo-subtitle">{subtitle}</p>
                </div>
            </Link>
        )
    }

    const renderNavItems = (isCollapsed) => {
        return (
            <nav className="sidebar__nav">
                {navigationItems.map((item, index) => {
                    const Icon = item.icon
                    const isTooltipActive = isCollapsed && activeTooltipIndex === index

                    return (
                        <div
                            key={item.path}
                            className="sidebar__item-wrapper"
                            onMouseEnter={() => isCollapsed && setActiveTooltipIndex(index)}
                            onMouseLeave={() => setActiveTooltipIndex(null)}
                        >
                            <NavLink
                                to={item.path}
                                onClick={isMobile ? closeMobile : undefined}
                                className={({ isActive }) =>
                                    `sidebar__item ${isActive ? 'sidebar__item--active' : ''} ${
                                        isCollapsed ? 'sidebar__item--collapsed' : ''
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="sidebar__item-left">
                                            <Icon
                                                size={20}
                                                strokeWidth={2}
                                                className={`sidebar__item-icon ${
                                                    isActive ? 'sidebar__item-icon--active' : ''
                                                }`}
                                            />
                                            <span
                                                className="sidebar__item-label"
                                                style={{
                                                    opacity: isCollapsed ? 0 : 1,
                                                    width: isCollapsed ? 0 : 'auto',
                                                    overflow: 'hidden',
                                                    transition: 'opacity 0.2s ease, width 0.3s ease',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {item.title}
                                            </span>
                                        </div>

                                        {item.badge && !isCollapsed && (
                                            <span
                                                className={`sidebar__item-badge ${
                                                    isActive ? 'sidebar__item-badge--active' : ''
                                                }`}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </NavLink>

                            {/* Tooltip when collapsed */}
                            {isTooltipActive && (
                                <div className="sidebar__tooltip">
                                    {item.title}
                                    {item.badge && (
                                        <span className="sidebar__tooltip-badge">{item.badge}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>
        )
    }

    const renderFooter = (isCollapsed) => {
        const initials = user?.name
            ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : role.charAt(0).toUpperCase()

        return (
            <div className="flex flex-col border-t border-gray-100 dark:border-gray-800 p-4 gap-4 mt-auto">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} overflow-hidden transition-all duration-300`}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold shrink-0 shadow-sm border border-white">
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0 transition-opacity duration-300">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                {user?.name || 'User'}
                            </span>
                            <span className="text-xs text-gray-400 truncate">
                                {user?.specialty || user?.email || role}
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="sidebar__item-wrapper">
                    <button
                        type="button"
                        onClick={onLogout}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-all duration-200 border-none bg-transparent`}
                        onMouseEnter={() => isCollapsed && setShowLogoutTooltip(true)}
                        onMouseLeave={() => setShowLogoutTooltip(false)}
                    >
                        <LogOut size={20} strokeWidth={2} className="shrink-0" />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                    {isCollapsed && showLogoutTooltip && (
                        <div className="sidebar__tooltip sidebar__tooltip--logout bg-red-600 text-white">
                            Logout
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (isMobile) {
        return (
            <>
                {/* Backdrop overlay */}
                <div
                    className={`sidebar-backdrop ${mobileOpen ? 'sidebar-backdrop--visible' : ''}`}
                    onClick={closeMobile}
                    aria-hidden="true"
                />

                {/* Drawer */}
                <aside
                    className={`sidebar sidebar--mobile ${mobileOpen ? 'sidebar--mobile-open' : ''}`}
                    role="navigation"
                    aria-label={`${role} navigation`}
                >
                    {renderLogo(false)}
                    {renderNavItems(false)}
                    {renderFooter(false)}
                </aside>
            </>
        )
    }

    // Desktop/Tablet: collapsible
    return (
        <aside
            className={`sidebar sidebar--desktop ${collapsed ? 'sidebar--collapsed' : ''}`}
            role="navigation"
            aria-label={`${role} navigation`}
        >
            {renderLogo(collapsed)}
            {renderNavItems(collapsed)}
            {renderFooter(collapsed)}
        </aside>
    )
}

export default Sidebar
