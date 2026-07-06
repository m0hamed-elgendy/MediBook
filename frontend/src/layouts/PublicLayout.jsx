import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import AnimatedPage from '../components/common/AnimatedPage'

export default function PublicLayout() {
    const location = useLocation()
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <main className="flex-1">
                <AnimatedPage key={location.pathname}>
                    <Outlet />
                </AnimatedPage>
            </main>
            <Footer/>
        </div>
    )
}