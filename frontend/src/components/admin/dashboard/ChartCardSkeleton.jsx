const ChartCardSkeleton = ({ height = 300 }) => (
    <div
        className="admin-chart-card admin-chart-card--skeleton"
        style={{ height }}
    >
        <div className="skeleton-box skeleton-text-sm" style={{ width: '40%', marginBottom: 16 }} />
        <div className="skeleton-box" style={{ flex: 1, borderRadius: 12 }} />
    </div>
)

export default ChartCardSkeleton
