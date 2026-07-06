import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444']

const AppointmentStatusChart = ({ data }) => {
    const chartData = [
        { name: 'Pending', value: data?.pending || 0 },
        { name: 'Confirmed', value: data?.confirmed || 0 },
        { name: 'Completed', value: data?.completed || 0 },
        { name: 'Cancelled', value: data?.cancelled || 0 },
    ]

    const total = chartData.reduce((sum, item) => sum + item.value, 0)

    return (
        <div className="admin-chart-card">
            <h3 className="admin-chart-title">Appointments Overview</h3>

            <div className="admin-donut-wrapper">
                <div className="admin-donut-chart">
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={3}
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
                    {chartData.map((item, index) => (
                        <div key={item.name} className="admin-legend-item">
                            <span
                                className="admin-legend-dot"
                                style={{ backgroundColor: COLORS[index] }}
                            />
                            <span className="admin-legend-text">
                                {item.name}
                            </span>
                            <span className="admin-legend-value">
                                {item.value} ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AppointmentStatusChart
