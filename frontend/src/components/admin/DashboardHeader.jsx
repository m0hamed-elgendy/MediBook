import { HiOutlineCalendarDays } from 'react-icons/hi2'

const DashboardHeader = () => {

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

            <div>

                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Welcome back, Admin 👋
                </p>

            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0 bg-white px-4 py-2 rounded-xl shadow-sm border">

                <HiOutlineCalendarDays
                    className="text-blue-600 text-xl"
                />

                <span className="text-gray-700 font-medium">
                    {today}
                </span>

            </div>

        </div>
    )
}

export default DashboardHeader