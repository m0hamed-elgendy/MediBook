import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})

    const handleSubmit = (e) => {
        e.preventDefault()

        const newErrors = {}

        if (!email.trim()) {
            newErrors.email = 'Email is required'
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required'
        }

        if (Object.keys(newErrors).length) {
            setErrors(newErrors)
            return
        }

        setErrors({})

        console.log({
            email,
            password,
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-[420px]"
        >
            <div className="bg-white rounded-2xl shadow-xl p-6">

                {/* Logo */}
                <div className="flex justify-center m-0">
                    <img
                        src="/images/logo.png"
                        alt="MediBook"

                        className="w-64 object-contain"
                    />
                </div>

                {/* Header */}
                <div className="text-center mb-5 mt-0">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h2>

                    <p className="mt-1 text-gray-500">
                        Sign in to continue to MediBook
                    </p>
                </div>

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
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
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
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>

                {/* Login */}
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                    Sign In
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
                    className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
                >
                    <FcGoogle size={20} />

                    <span>
                        Continue with Google
                    </span>
                </button>

                {/* Register */}
                <p className="mt-5 text-center text-gray-600">
                    Don't have an account?

                    <Link
                        to="/register"
                        className="ml-2 text-blue-600 font-semibold hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </form>
    )
}

export default LoginForm