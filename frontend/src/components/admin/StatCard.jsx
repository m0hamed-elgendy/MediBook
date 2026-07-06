const StatCard = ({
    title,
    value,
    subtitle,
    subtitleIcon,
    icon,
    iconBg,
    iconColor,
    loading,
}) => {
    if (loading) {
        return <StatCardSkeleton />
    }

    return (
        <div className="admin-stat-card">
            <div className="admin-stat-card-top">
                <div
                    className="admin-stat-icon"
                    style={{ backgroundColor: iconBg, color: iconColor }}
                >
                    {icon}
                </div>
                <div className="admin-stat-info">
                    <p className="admin-stat-title">{title}</p>
                    <h2 className="admin-stat-value">{value}</h2>
                </div>
            </div>
            {subtitle && (
                <p className="admin-stat-subtitle">
                    {subtitleIcon && (
                        <span className="admin-stat-arrow" style={{ color: '#10B981' }}>
                            {subtitleIcon}
                        </span>
                    )}
                    {subtitle}
                </p>
            )}
        </div>
    )
}

const StatCardSkeleton = () => (
    <div className="admin-stat-card admin-stat-card--skeleton">
        <div className="admin-stat-card-top">
            <div className="skeleton-box skeleton-icon" />
            <div className="admin-stat-info">
                <div className="skeleton-box skeleton-text-sm" />
                <div className="skeleton-box skeleton-text-lg" />
            </div>
        </div>
        <div className="skeleton-box skeleton-text-xs" style={{ marginTop: 10 }} />
    </div>
)

export { StatCardSkeleton }
export default StatCard