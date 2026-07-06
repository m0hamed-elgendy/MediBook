import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider, useSidebar } from '../context/SidebarContext'
import AdminSidebar from '../components/admin/sidebar/AdminSidebar'
import AdminHeader from '../components/admin/header/AdminHeader'
import AnimatedPage from '../components/common/AnimatedPage'

const AdminLayoutInner = () => {
    const { collapsed, isMobile } = useSidebar()
    const location = useLocation()

    return (
        <div className="admin-layout-root">
            <AdminSidebar />

            <div
                className="admin-layout-main"
                style={{
                    marginLeft: isMobile ? 0 : collapsed ? 88 : 280,
                    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <AdminHeader />

                <main className="admin-layout-content">
                    <AnimatedPage key={location.pathname}>
                        <Outlet />
                    </AnimatedPage>
                </main>
            </div>
        </div>
    )
}

const AdminLayout = () => (
    <SidebarProvider>
        <AdminLayoutInner />
    </SidebarProvider>
)

export default AdminLayout