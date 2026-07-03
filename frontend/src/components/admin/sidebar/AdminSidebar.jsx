import SidebarLogo from './SidebarLogo'
import SidebarItem from './SidebarItem'
import SidebarFooter from './SidebarFooter'
import { adminNavigation } from './navigation'

const user = {
    name: 'Mohamed Elgendy',
    email: 'admin@medibook.com',
    profileImage: null,
}

const AdminSidebar = () => {
    return (
        <aside className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col">

            <SidebarLogo />

            <nav className="flex-1 px-4 py-6 space-y-2">

                {adminNavigation.map((item) => (
                    <SidebarItem
                        key={item.path}
                        item={item}
                    />
                ))}

            </nav>

            <SidebarFooter
                user={user}
            />

        </aside>
    )
}

export default AdminSidebar