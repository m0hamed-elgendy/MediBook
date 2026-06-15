import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import authServices from '../../services/auth.service'
import { useAuth } from '../../context/AuthContext'
import Loader from '../common/Loader'

const LogoFallback = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="url(#logoGrad)" />
            <path d="M10 18h4l3-6 4 12 3-9h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
                    <stop stopColor="#378ADD" />
                    <stop offset="1" stopColor="#185FA5" />
                </linearGradient>
            </defs>
        </svg>
        <span style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#185FA5' }}>Medi</span>
            <span style={{ color: '#E24B4A' }}>Book</span>
        </span>
    </div>
)

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [logoError, setLogoError] = useState(false)

    if (loading) {
        return <Loader />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}
        if (!email.trim()) newErrors.email = 'Email is required'
        if (!password.trim()) newErrors.password = 'Password is required'
        if (Object.keys(newErrors).length) {
            setErrors(newErrors)
            return
        }
        try {
            setLoading(true)
            setErrors({})
            await new Promise(resolve => setTimeout(resolve, 3000))
            const data = await authServices.Login({ email, password })
            login(data.user, data.token.accessToken, data.token.refreshToken)
            if (data.user.role === 'admin') navigate('/admin/dashboard', { replace: true })
            else if (data.user.role === 'doctor') navigate('/doctor/dashboard', { replace: true })
            else navigate('/patient/dashboard', { replace: true })
        } catch (err) {
            const message = err.response?.data?.message
            if (Array.isArray(message)) {
                const backendErrors = {}
                message.forEach(error => {
                    if (error.toLowerCase().includes('email')) backendErrors.email = error
                    if (error.toLowerCase().includes('password')) backendErrors.password = error
                })
                setErrors(backendErrors)
            } else {
                setError(message || 'Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-card">

                {/* Gradient accent line */}
                <div className="auth-card-accent"></div>

                {/* Logo */}
                <div className="auth-logo-wrapper">
                    {logoError ? (
                        <LogoFallback />
                    ) : (
                        <img
                            src="/images/logo.png"
                            alt="MediBook"
                            className="auth-logo-img"
                            onError={() => setLogoError(true)}
                        />
                    )}
                </div>

                {/* Subtitle */}
                <p className="auth-subtitle">
                    Welcome back! Sign in to your account
                </p>

                {/* Error */}
                {error && (
                    <div className="auth-error-banner">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="8" fill="#FEE2E2" />
                            <path d="M8 4v4M8 10h.01" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Email */}
                <div className="auth-field">
                    <label className="auth-label">Email</label>
                    <div className="auth-input-wrapper">
                        <FiMail className="auth-input-icon" />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                        />
                    </div>
                    {errors.email && <p className="auth-error-text">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="auth-field">
                    <label className="auth-label">Password</label>
                    <div className="auth-input-wrapper">
                        <FiLock className="auth-input-icon" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`auth-input auth-input-password ${errors.password ? 'auth-input-error' : ''}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="auth-toggle-password"
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    {errors.password && <p className="auth-error-text">{errors.password}</p>}
                </div>

                {/* Forgot Password */}
                <div className="auth-forgot-row">
                    <button type="button" className="auth-forgot-btn">
                        Forgot Password?
                    </button>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className="auth-submit-btn">
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Divider */}
                <div className="auth-divider">
                    <div className="auth-divider-line"></div>
                    <span className="auth-divider-text">OR</span>
                    <div className="auth-divider-line"></div>
                </div>

                {/* Google */}
                <button type="button" className="auth-google-btn">
                    <FcGoogle size={20} />
                    <span>Continue with Google</span>
                </button>

                {/* Register link */}
                <p className="auth-footer-text">
                    Don't have an account?
                    <Link to="/register" className="auth-footer-link">Register</Link>
                </p>

            </div>
        </form>
    )
}

export default LoginForm