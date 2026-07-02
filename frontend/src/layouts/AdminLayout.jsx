import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    FiGrid, FiUsers, FiCalendar, FiStar,
    FiLogOut, FiActivity
} from 'react-icons/fi'

const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/admin/users', label: 'Users', icon: FiUsers },
    { to: '/admin/doctors', label: 'Doctors', icon: FiActivity },
    { to: '/admin/appointments', label: 'Appointments', icon: FiCalendar },
    { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
]

const AdminLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'AD'

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                {/* Logo */}
                <div className="admin-sidebar-logo">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect width="28" height="28" rx="8" fill="#D32F2F" />
                        <path d="M8 14h12M14 8v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <div className="admin-sidebar-logo-wrap">
                        <span className="admin-sidebar-logo-text">MediBook</span>
                        <span className="admin-sidebar-logo-sub">Admin Portal</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="admin-sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `admin-nav-item ${isActive ? 'admin-nav-item-active' : ''}`
                            }
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile & Logout */}
                <div className="admin-sidebar-footer">
                    <div className="admin-sidebar-user">
                        <div className="admin-sidebar-avatar">{initials}</div>
                        <div className="admin-sidebar-user-info">
                            <span className="admin-sidebar-user-name">{user?.name || 'Administrator'}</span>
                            <span className="admin-sidebar-user-role">System Admin</span>
                        </div>
                    </div>
                    <button className="admin-nav-item admin-logout-btn" onClick={handleLogout}>
                        <FiLogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="admin-main-wrapper">
                {/* Topbar */}
                <header className="admin-topbar">
                    <div className="admin-topbar-title">Admin Management Console</div>
                    <div className="admin-badge">Live System</div>
                </header>

                {/* Page Content */}
                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
