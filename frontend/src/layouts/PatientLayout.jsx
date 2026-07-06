import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AnimatedPage from '../components/common/AnimatedPage'
import {
    FiGrid, FiCalendar, FiMessageSquare,
    FiSettings, FiHelpCircle, FiLogOut
} from 'react-icons/fi'

const navItems = [
    { to: '/patient/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/patient/appointments', label: 'Appointments', icon: FiCalendar },
    { to: '/patient/messages', label: 'Messages', icon: FiMessageSquare },
    { to: '/patient/settings', label: 'Settings', icon: FiSettings },
    { to: '/patient/help', label: 'Help Center', icon: FiHelpCircle },
]

const PatientLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U'

    return (
        <div className="patient-layout">
            {/* Sidebar */}
            <aside className="patient-sidebar">
                {/* Logo */}
                <div className="patient-sidebar-logo">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect width="28" height="28" rx="8" fill="#1565C0" />
                        <path d="M8 14h12M14 8v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <span className="patient-sidebar-logo-text">MediBook</span>
                </div>

                {/* Navigation */}
                <nav className="patient-sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `patient-nav-item ${isActive ? 'patient-nav-item-active' : ''}`
                            }
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile & Logout */}
                <div className="patient-sidebar-footer">
                    <div className="patient-sidebar-user">
                        <div className="patient-sidebar-avatar">{initials}</div>
                        <div className="patient-sidebar-user-info">
                            <span className="patient-sidebar-user-name">{user?.name || 'Patient'}</span>
                            <span className="patient-sidebar-user-id">
                                Patient ID: #{user?._id?.slice(-5) || '00000'}
                            </span>
                        </div>
                    </div>
                    <button className="patient-nav-item patient-logout-btn" onClick={handleLogout}>
                        <FiLogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="patient-main">
                <AnimatedPage>
                    <Outlet />
                </AnimatedPage>
            </main>
        </div>
    )
}

export default PatientLayout