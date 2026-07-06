import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6']

const SpecialtyChart = ({ data }) => {
    const chartData = data && data.length > 0 ? data : [
        { name: 'Cardiology', value: 5 },
        { name: 'Dermatology', value: 4 },
        { name: 'Pediatrics', value: 4 },
        { name: 'Orthopedics', value: 3 },
        { name: 'Neurology', value: 2 },
        { name: 'Others', value: 7 },
    ]

    const total = chartData.reduce((sum, item) => sum + item.value, 0)

    return (
        <div className="admin-chart-card">
            <h3 className="admin-chart-title">Specialty Distribution</h3>

            <div className="admin-specialty-wrapper">
                <div className="admin-specialty-chart">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                innerRadius={0}
                                paddingAngle={2}
                                dataKey="value"
                                strokeWidth={2}
                                stroke="#fff"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="admin-specialty-legend">
                    {chartData.map((item, index) => (
                        <div key={item.name} className="admin-legend-item">
                            <span
                                className="admin-legend-dot"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="admin-legend-text">{item.name}</span>
                            <span className="admin-legend-value">
                                {item.value} ({total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SpecialtyChart
