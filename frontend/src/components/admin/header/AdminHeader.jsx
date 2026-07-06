import { useState, useCallback } from 'react'
import { Bell, Search, Menu, PanelLeftClose, User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { useSidebar } from '../../../context/SidebarContext'
import useClickOutside from '../../../hooks/useClickOutside'

const AdminHeader = () => {
    const { user, logout } = useAuth()
    const { toggleCollapsed, toggleMobile, isMobile } = useSidebar()

    const [notifOpen, setNotifOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

    const closeNotif = useCallback(() => setNotifOpen(false), [])
    const closeProfile = useCallback(() => setProfileOpen(false), [])

    const notifRef = useClickOutside(closeNotif)
    const profileRef = useClickOutside(closeProfile)

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'A'

    const handleToggle = () => {
        if (isMobile) {
            toggleMobile()
        } else {
            toggleCollapsed()
        }
    }

    const handleLogout = () => {
        closeProfile()
        logout()
    }

    return (
        <header className="admin-header">

            {/* Left: Toggle + Search */}
            <div className="admin-header-left">

                <button
                    className="admin-header-menu-btn"
                    onClick={handleToggle}
                    aria-label="Toggle sidebar"
                >
                    {isMobile ? <Menu size={20} /> : <PanelLeftClose size={20} />}
                </button>

                <div className="admin-header-search">
                    <Search size={16} className="admin-header-search-icon" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="admin-header-search-input"
                    />
                    <div className="admin-header-search-shortcut">
                        <span>⌘</span><span>K</span>
                    </div>
                </div>

            </div>

            {/* Right side */}
            <div className="admin-header-right">

                {/* Notifications */}
                <div className="admin-header-notif-wrapper" ref={notifRef}>
                    <button
                        className="admin-header-notif-btn"
                        onClick={() => setNotifOpen(prev => !prev)}
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        <span className="admin-header-notif-badge">3</span>
                    </button>

                    {notifOpen && (
                        <div className="admin-notif-dropdown">
                            <div className="admin-notif-dropdown__header">
                                Notifications
                            </div>
                            <div className="admin-notif-dropdown__empty">
                                No new notifications
                            </div>
                            <div className="admin-notif-dropdown__footer">
                                <a href="#" onClick={(e) => e.preventDefault()}>
                                    View all notifications
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="admin-header-divider" />

                {/* Profile */}
                <div className="admin-header-profile-wrapper" ref={profileRef}>
                    <button
                        className="admin-header-user"
                        onClick={() => setProfileOpen(prev => !prev)}
                    >
                        <div className="admin-header-avatar">
                            {initials}
                        </div>
                        <div className="admin-header-user-info">
                            <span className="admin-header-user-name">
                                {user?.name || 'Admin'}
                            </span>
                            <span className="admin-header-user-role">
                                Administrator
                            </span>
                        </div>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className={`admin-header-chevron ${profileOpen ? 'admin-header-chevron--open' : ''}`}
                        >
                            <path
                                d="M4 6L8 10L12 6"
                                stroke="#94A3B8"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    {profileOpen && (
                        <div className="admin-profile-dropdown">
                            <button
                                className="admin-profile-dropdown__item"
                                onClick={closeProfile}
                            >
                                <User size={16} />
                                Profile
                            </button>
                            <button
                                className="admin-profile-dropdown__item"
                                onClick={closeProfile}
                            >
                                <Settings size={16} />
                                Settings
                            </button>
                            <div className="admin-profile-dropdown__divider" />
                            <button
                                className="admin-profile-dropdown__item admin-profile-dropdown__item--danger"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>

            </div>

        </header>
    )
}

export default AdminHeader
