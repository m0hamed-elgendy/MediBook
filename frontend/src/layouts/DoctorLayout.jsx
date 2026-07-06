import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AnimatedPage from '../components/common/AnimatedPage'
import {
    FiGrid, FiCalendar, FiClipboard,
    FiStar, FiUser, FiLogOut, FiBell, FiPlusCircle
} from 'react-icons/fi'
import { Link } from 'react-router-dom'

const navItems = [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/doctor/schedule', label: "Today's Schedule", icon: FiClipboard },
    { to: '/doctor/appointments', label: 'Appointments', icon: FiCalendar },
    { to: '/doctor/reviews', label: 'Reviews', icon: FiStar },
    { to: '/doctor/profile', label: 'Profile', icon: FiUser },
]

const DoctorLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'D'

    return (
        <div className="doc-layout">
            {/* Sidebar */}
            <aside className="doc-sidebar">
                {/* Logo */}
                <div className="doc-sidebar-logo">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect width="28" height="28" rx="8" fill="#1565C0" />
                        <path d="M8 14h12M14 8v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <div className="doc-sidebar-logo-wrap">
                        <span className="doc-sidebar-logo-text">MediBook</span>
                        <span className="doc-sidebar-logo-sub">Doctor Dashboard</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="doc-sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `doc-nav-item ${isActive ? 'doc-nav-item-active' : ''}`
                            }
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile & Logout */}
                <div className="doc-sidebar-footer">
                    <div className="doc-sidebar-user">
                        <div className="doc-sidebar-avatar">{initials}</div>
                        <div className="doc-sidebar-user-info">
                            <span className="doc-sidebar-user-name">
                                Dr. {user?.name || 'Doctor'}
                            </span>
                            <span className="doc-sidebar-user-role">
                                {user?.specialty || 'Specialist'}
                            </span>
                        </div>
                    </div>
                    <button className="doc-nav-item doc-logout-btn" onClick={handleLogout}>
                        <FiLogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="doc-main-wrapper">
                {/* Top Bar */}
                <header className="doc-topbar">
                    <div className="doc-topbar-spacer" />
                    <div className="doc-topbar-actions">
                        <button className="doc-topbar-bell" aria-label="Notifications">
                            <FiBell size={20} />
                            <span className="doc-topbar-bell-dot" />
                        </button>
                        <Link to="/doctor/appointments" className="doc-topbar-cta">
                            <FiPlusCircle size={16} />
                            Book New Appointment
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="doc-main">
                    <AnimatedPage>
                        <Outlet />
                    </AnimatedPage>
                </main>

                {/* Footer */}
                <footer className="doc-footer">
                    <div className="doc-footer-left">
                        <span className="doc-footer-brand">MediBook</span>
                        <span className="doc-footer-copy">© 2024 MediBook. All rights reserved.</span>
                    </div>
                    <div className="doc-footer-links">
                        <a href="#">About</a>
                        <a href="#">Services</a>
                        <a href="#">Contact</a>
                        <a href="#">Privacy</a>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default DoctorLayout