import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts'

const DEFAULT_DATA = [
    { name: 'Jan', appointments: 18 },
    { name: 'Feb', appointments: 22 },
    { name: 'Mar', appointments: 28 },
    { name: 'Apr', appointments: 25 },
    { name: 'May', appointments: 32 },
    { name: 'Jun', appointments: 35 },
    { name: 'Jul', appointments: 45 },
]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="admin-chart-tooltip">
                <p className="admin-chart-tooltip-label">{label}</p>
                <p className="admin-chart-tooltip-value">
                    {payload[0].value} appointments
                </p>
            </div>
        )
    }
    return null
}

const MonthlyChart = ({ data }) => {
    const chartData = data && data.length > 0 ? data : DEFAULT_DATA

    return (
        <div className="admin-chart-card admin-chart-card-wide">
            <div className="admin-chart-header">
                <h3 className="admin-chart-title">Appointments (Monthly)</h3>
                <div className="admin-chart-filter">
                    <span>This Year</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="appointments"
                        stroke="#3B82F6"
                        strokeWidth={2.5}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, stroke: '#fff', r: 5 }}
                        activeDot={{ r: 7, fill: '#3B82F6', stroke: '#fff', strokeWidth: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default MonthlyChart
