const StatCard = ({
    title,
    value,
    percentage,
    icon,
    color,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {value}
                    </h2>

                    {percentage !== undefined && (
                        <p className="mt-2 text-sm text-gray-500">
                            {percentage}% of total
                        </p>
                    )}

                </div>

                <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color}`}
                >
                    {icon}
                </div>

            </div>

        </div>
    )
}

export default StatCard