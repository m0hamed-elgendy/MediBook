import { HeartPulse } from 'lucide-react'
import { Link } from 'react-router-dom'

const SidebarLogo = ({ collapsed }) => {
    return (
        <Link
            to="/admin/dashboard"
            className="sidebar__logo"
        >
            <div className="sidebar__logo-icon">
                <HeartPulse size={24} />
            </div>

            <div
                className="sidebar__logo-text-wrap"
                style={{
                    opacity: collapsed ? 0 : 1,
                    width: collapsed ? 0 : 'auto',
                    overflow: 'hidden',
                    transition: 'opacity 0.2s ease, width 0.3s ease',
                    whiteSpace: 'nowrap',
                }}
            >
                <h1 className="sidebar__logo-title">
                    MediBook
                </h1>
                <p className="sidebar__logo-subtitle">
                    Healthcare Admin
                </p>
            </div>
        </Link>
    )
}

export default SidebarLogo