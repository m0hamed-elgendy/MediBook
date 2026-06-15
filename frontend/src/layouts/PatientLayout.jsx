import { Outlet } from 'react-router-dom'

const PatientLayout = () => {
    return (
        <div className="flex min-h-screen">

            <aside className="w-64 bg-blue-600 text-white p-4">
                <h2 className="text-2xl font-bold mb-6">
                    MediBook
                </h2>

                <nav className="space-y-3">
                    <p>Dashboard</p>
                    <p>Doctors</p>
                    <p>Appointments</p>
                    <p>Profile</p>
                </nav>
            </aside>

            <main className="flex-1 p-6 bg-gray-50">
                <Outlet />
            </main>

        </div>
    )
}

export default PatientLayout