import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import authServices from '../../services/auth.service'
import { useAuth } from '../../context/AuthContext'
import Loader from '../common/Loader'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false);
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState('')



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
            await new Promise(resolve =>
                setTimeout(resolve, 3000)
            )

            const data = await authServices.Login({ email, password });
            login(data.user, data.token.accessToken)

            if (data.user.role === 'admin') navigate('/admin/dashboard', { replace: true })
            else if (data.user.role === 'doctor') navigate('/doctor/dashboard', { replace: true })
            else navigate('/patient/dashboard', { replace: true })

        }
        catch (err) {

            const message = err.response?.data?.message

            if (Array.isArray(message)) {

                const backendErrors = {}

                message.forEach(error => {

                    if (error.toLowerCase().includes('email')) {
                        backendErrors.email = error
                    }

                    if (error.toLowerCase().includes('password')) {
                        backendErrors.password = error
                    }

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
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-[420px] lg:shadow-none shadow-xl lg:rounded-none rounded-2xl lg:p-0 p-6 bg-white"
            noValidate
        >

            {/* Logo */}
            <div className="flex justify-center m-0">
                <img
                    src="/images/logo.png"
                    alt="MediBook"

                    className="w-64 object-contain"
                />
            </div>

            {
                error && (
                    <p className="mb-3 text-center text-red-500 text-sm">
                        {error}
                    </p>
                )
            }

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>

                <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                    />
                </div>

                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                    </p>
                )}
            </div>

            {/* Password */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>

                <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-blue-500"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>

                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                    </p>
                )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mt-2">
                <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                >
                    Forgot Password?
                </button>
            </div>

            {/* Login */}
            <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
                {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
                <div className="h-px bg-gray-200 flex-1"></div>

                <span className="text-sm text-gray-400">
                    OR
                </span>

                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Google */}
            <button
                type="button"
                className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition cursor-pointer"
            >
                <FcGoogle size={20} />

                <span>
                    Continue with Google
                </span>
            </button>

            {/* Register */}
            <p className="mt-5 text-center text-gray-600 cursor-pointer">
                Don't have an account?

                <Link
                    to="/register"
                    className="ml-2 text-blue-600 font-semibold hover:underline"
                >
                    Register
                </Link>
            </p>

        </form>
    )
}

export default LoginForm