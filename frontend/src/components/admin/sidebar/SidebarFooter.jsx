import { ChevronDown } from 'lucide-react'

const SidebarFooter = ({ user, collapsed, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`sidebar__footer ${collapsed ? 'sidebar__footer--collapsed' : ''}`}
        >
            <div className="sidebar__footer-inner">
                <div className="sidebar__footer-left">
                    <div className="sidebar__footer-avatar">
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.name}
                                className="sidebar__footer-avatar-img"
                            />
                        ) : (
                            user?.name?.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div
                        className="sidebar__footer-info"
                        style={{
                            opacity: collapsed ? 0 : 1,
                            width: collapsed ? 0 : 'auto',
                            overflow: 'hidden',
                            transition: 'opacity 0.2s ease, width 0.3s ease',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <h4 className="sidebar__footer-name">
                            {user?.name}
                        </h4>
                        <p className="sidebar__footer-email">
                            {user?.email}
                        </p>
                    </div>
                </div>

                {!collapsed && (
                    <ChevronDown
                        size={16}
                        className="sidebar__footer-chevron"
                    />
                )}
            </div>
        </button>
    )
}

export default SidebarFooter