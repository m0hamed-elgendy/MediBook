import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/sidebar/AdminSidebar'
import AdminHeader from '../components/admin/header/AdminHeader'

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">

            <AdminSidebar />

            <div className="flex-1 flex flex-col">

                <AdminHeader />

                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>

            </div>

        </div>
    )
}

export default AdminLayout