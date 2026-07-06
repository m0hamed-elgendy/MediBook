import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const SidebarItem = ({ item, collapsed, onNavigate }) => {
    const Icon = item.icon
    const [showTooltip, setShowTooltip] = useState(false)

    return (
        <div
            className="sidebar__item-wrapper"
            onMouseEnter={() => collapsed && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <NavLink
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                    `sidebar__item ${isActive ? 'sidebar__item--active' : ''} ${collapsed ? 'sidebar__item--collapsed' : ''}`
                }
            >
                {({ isActive }) => (
                    <>
                        <div className="sidebar__item-left">
                            <Icon
                                size={20}
                                strokeWidth={2}
                                className={`sidebar__item-icon ${isActive ? 'sidebar__item-icon--active' : ''}`}
                            />

                            <span
                                className="sidebar__item-label"
                                style={{
                                    opacity: collapsed ? 0 : 1,
                                    width: collapsed ? 0 : 'auto',
                                    overflow: 'hidden',
                                    transition: 'opacity 0.2s ease, width 0.3s ease',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {item.title}
                            </span>
                        </div>

                        {item.badge && !collapsed && (
                            <span
                                className={`sidebar__item-badge ${isActive ? 'sidebar__item-badge--active' : ''}`}
                            >
                                {item.badge}
                            </span>
                        )}
                    </>
                )}
            </NavLink>

            {/* Tooltip when collapsed */}
            {collapsed && showTooltip && (
                <div className="sidebar__tooltip">
                    {item.title}
                    {item.badge && (
                        <span className="sidebar__tooltip-badge">{item.badge}</span>
                    )}
                </div>
            )}
        </div>
    )
}

export default SidebarItem