import Sidebar from '../../common/Sidebar'
import { adminNavigation } from './navigation'
import { useAuth } from '../../../context/AuthContext'

const AdminSidebar = () => {
    const { user, logout } = useAuth()

    return (
        <Sidebar
            navigationItems={adminNavigation}
            user={{
                name: user?.name || 'Admin',
                email: user?.email || 'admin@medibook.com',
                profileImage: null,
            }}
            role="admin"
            onLogout={logout}
        />
    )
}

export default AdminSidebar