import { HiOutlineCalendarDays } from 'react-icons/hi2'

const DashboardHeader = () => {

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="admin-dashboard-header">

            <div>

                <h1 className="admin-dashboard-title">
                    Dashboard
                </h1>

                <p className="admin-dashboard-subtitle">
                    Welcome back, Admin! Here's what's happening with your platform today.
                </p>

            </div>

            <div className="admin-date-badge">

                <HiOutlineCalendarDays
                    className="admin-date-icon"
                />

                <span className="admin-date-text">
                    {today}
                </span>

            </div>

        </div>
    )
}

export default DashboardHeader