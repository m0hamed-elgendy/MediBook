import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <h1>Medical App</h1>

            <Outlet />
        </div>
    )
}