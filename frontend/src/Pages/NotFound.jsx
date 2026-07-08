import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

const NotFound = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const handleGoDashboard = () => {
        if (!user) {
            navigate('/')
            return
        }
        if (user.role === 'admin') {
            navigate('/admin/dashboard')
        } else if (user.role === 'doctor') {
            navigate('/doctor/dashboard')
        } else {
            navigate('/patient/dashboard')
        }
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 min-h-[70vh] animate-in fade-in duration-300">
            <div className="mb-6 flex justify-center w-full">
                <svg className="w-full max-w-[380px] h-auto" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background soft circle */}
                    <circle cx="200" cy="125" r="90" fill="#EFF6FF" opacity="0.8"/>
                    
                    {/* Cloud 1 */}
                    <path d="M70 90C70 82 76 76 84 76C87 76 90 77 92 79C95 72 102 68 109 68C117 68 124 73 125 80C127 79 130 78 132 78C139 78 145 84 145 92C145 99 139 105 132 105H84C76 105 70 99 70 90Z" fill="#DBEAFE" opacity="0.6"/>
                    
                    {/* Cloud 2 */}
                    <path d="M260 120C260 114 265 109 271 109C273 109 275 110 277 111C279 106 284 103 289 103C295 103 299 107 300 112C301 111 303 111 305 111C311 111 316 116 316 122C316 128 311 133 305 133H271C265 133 260 128 260 120Z" fill="#DBEAFE" opacity="0.6"/>

                    {/* Sparkles / Decors */}
                    <path d="M100 45V51M97 48H103" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M315 75V81M312 78H318" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="85" cy="130" r="3" stroke="#93C5FD" strokeWidth="1.5"/>
                    <circle cx="295" cy="95" r="4" stroke="#93C5FD" strokeWidth="1.5"/>

                    {/* Signpost */}
                    <rect x="256" y="80" width="8" height="110" rx="4" fill="#94A3B8"/>
                    <rect x="252" y="185" width="16" height="6" rx="2" fill="#64748B"/>
                    
                    {/* Sign 1 (Right Pointing) */}
                    <path d="M256 95H295L305 105L295 115H256V95Z" fill="#3B82F6"/>
                    {/* Sign 2 (Left Pointing) */}
                    <path d="M260 120H220L210 130L220 140H260V120Z" fill="#60A5FA"/>

                    {/* Ground line */}
                    <path d="M60 190H340" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round"/>

                    {/* Base Plants */}
                    <path d="M120 190C120 175 130 165 135 165C140 165 145 175 145 190H120Z" fill="#3B82F6" opacity="0.6"/>
                    <path d="M265 190C265 175 273 165 278 165C283 165 288 175 288 190H265Z" fill="#3B82F6" opacity="0.6"/>

                    {/* Big 404 Text */}
                    <text x="175" y="165" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="82" fill="#3B82F6" text-anchor="middle" letter-spacing="-0.03em">
                        404
                    </text>
                </svg>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                Oops! Page not found
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-3 max-w-md leading-relaxed">
                The page you're looking for doesn't exist or has been moved.
                <br /> Please check the URL or go back to the dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button onClick={handleGoDashboard} variant="primary" icon={Home} className="h-11 px-6 justify-center">
                    Go to Dashboard
                </Button>
                <Button onClick={handleGoBack} variant="outline" icon={ArrowLeft} className="h-11 px-6 justify-center">
                    Go Back
                </Button>
            </div>
        </div>
    )
}

export default NotFound