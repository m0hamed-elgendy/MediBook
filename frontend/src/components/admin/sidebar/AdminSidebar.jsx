import { useSidebar } from '../../../context/SidebarContext'
import SidebarLogo from './SidebarLogo'
import SidebarItem from './SidebarItem'
import SidebarFooter from './SidebarFooter'
import { adminNavigation } from './navigation'

const user = {
    name: 'Admin',
    email: 'admin@medibook.com',
    profileImage: null,
}

const AdminSidebar = () => {
    const { collapsed, isMobile, mobileOpen, closeMobile } = useSidebar()

    // Mobile: render as a slide-over drawer with backdrop
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
                    aria-label="Admin navigation"
                >
                    <SidebarLogo collapsed={false} />

                    <nav className="sidebar__nav">
                        {adminNavigation.map((item) => (
                            <SidebarItem
                                key={item.path}
                                item={item}
                                collapsed={false}
                                onNavigate={closeMobile}
                            />
                        ))}
                    </nav>

                    <SidebarFooter user={user} collapsed={false} />
                </aside>
            </>
        )
    }

    // Desktop: fixed sidebar with collapse support
    return (
        <aside
            className={`sidebar sidebar--desktop ${collapsed ? 'sidebar--collapsed' : ''}`}
            role="navigation"
            aria-label="Admin navigation"
        >
            <SidebarLogo collapsed={collapsed} />

            <nav className="sidebar__nav">
                {adminNavigation.map((item) => (
                    <SidebarItem
                        key={item.path}
                        item={item}
                        collapsed={collapsed}
                    />
                ))}
            </nav>

            <SidebarFooter user={user} collapsed={collapsed} />
        </aside>
    )
}

export default AdminSidebar