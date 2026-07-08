import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { SidebarProvider, useSidebar } from '../context/SidebarContext'
import Sidebar from '../components/common/Sidebar'
import AnimatedPage from '../components/common/AnimatedPage'
import { LayoutDashboard, ClipboardList, CalendarDays, Star, User, Bell, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

const doctorNavigation = [
    { title: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { title: "Today's Schedule", path: '/doctor/schedule', icon: ClipboardList },
    { title: 'Appointments', path: '/doctor/appointments', icon: CalendarDays },
    { title: 'Reviews', path: '/doctor/reviews', icon: Star },
    { title: 'Profile', path: '/doctor/profile', icon: User },
]

const DoctorLayoutInner = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { collapsed, isMobile, toggleCollapsed, toggleMobile } = useSidebar()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleToggle = () => {
        if (isMobile) {
            toggleMobile()
        } else {
            toggleCollapsed()
        }
    }

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'D'

    return (
        <div className="admin-layout-root">
            {/* Sidebar */}
            <Sidebar
                navigationItems={doctorNavigation}
                user={{
                    name: user?.name ? `Dr. ${user.name}` : 'Doctor',
                    specialty: user?.specialty || 'Specialist',
                    profileImage: user?.profileImage || null,
                }}
                role="doctor"
                onLogout={handleLogout}
            />

            {/* Main Wrapper */}
            <div
                className="admin-layout-main"
                style={{
                    marginLeft: isMobile ? 0 : collapsed ? 88 : 280,
                    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Header / Top Bar */}
                <header className="admin-header">
                    <div className="admin-header-left">
                        <button
                            type="button"
                            className="admin-header-menu-btn cursor-pointer"
                            onClick={handleToggle}
                            aria-label="Toggle sidebar"
                        >
                            {isMobile ? (
                                <Menu size={20} />
                            ) : collapsed ? (
                                <PanelLeftOpen size={20} />
                            ) : (
                                <PanelLeftClose size={20} />
                            )}
                        </button>
                    </div>

                    <div className="admin-header-right">
                        <button type="button" className="admin-header-notif-btn cursor-pointer" aria-label="Notifications">
                            <Bell size={20} />
                            <span className="admin-header-notif-badge"></span>
                        </button>
                        
                        <div className="admin-header-divider" />
                        
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm border border-white">
                                {initials}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-xs font-semibold text-gray-800">
                                    Dr. {user?.name || 'Doctor'}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    {user?.specialty || 'Specialist'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="admin-layout-content">
                    <AnimatedPage key={location.pathname}>
                        <Outlet />
                    </AnimatedPage>
                </main>
            </div>
        </div>
    )
}

const DoctorLayout = () => (
    <SidebarProvider>
        <DoctorLayoutInner />
    </SidebarProvider>
)

export default DoctorLayout