import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#10B981', '#E5E7EB']

const UsersStatusChart = ({ data }) => {
    const active = data?.active || 0
    const inactive = data?.inactive || 0
    const total = active + inactive

    const chartData = [
        { name: 'Active Users', value: active },
        { name: 'Inactive Users', value: inactive || 0 },
    ]

    // If all active and no inactive, show a tiny sliver so the chart renders properly
    if (inactive === 0 && active > 0) {
        chartData[1].value = 0
    }

    return (
        <div className="admin-chart-card">
            <h3 className="admin-chart-title">Users Status</h3>

            <div className="admin-donut-wrapper">
                <div className="admin-donut-chart">
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={65}
                                paddingAngle={2}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="admin-donut-center">
                        <span className="admin-donut-total">{total}</span>
                        <span className="admin-donut-label">Total</span>
                    </div>
                </div>

                <div className="admin-donut-legend">
                    <div className="admin-legend-item">
                        <span className="admin-legend-dot" style={{ backgroundColor: COLORS[0] }} />
                        <span className="admin-legend-text">Active Users</span>
                        <span className="admin-legend-value">
                            {active} ({total > 0 ? ((active / total) * 100).toFixed(0) : 0}%)
                        </span>
                    </div>
                    <div className="admin-legend-item">
                        <span className="admin-legend-dot" style={{ backgroundColor: COLORS[1] }} />
                        <span className="admin-legend-text">Inactive Users</span>
                        <span className="admin-legend-value">
                            {inactive} ({total > 0 ? ((inactive / total) * 100).toFixed(0) : 0}%)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersStatusChart
