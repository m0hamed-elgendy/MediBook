import React, { useState } from 'react'
import Loader from '../common/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'

import {
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import authServices from '../../services/auth.service'

const LogoFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="url(#logoGrad2)" />
      <path d="M10 18h4l3-6 4 12 3-9h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="logoGrad2" x1="0" y1="0" x2="36" y2="36">
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

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return <Loader />
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setErrors({})

    const newErrors = {}

    if (!formData.name.trim())
      newErrors.name = 'Name is required'

    if (!formData.phone.trim())
      newErrors.phone = 'Phone is required'

    if (!formData.email.trim())
      newErrors.email = 'Email is required'

    if (!formData.password.trim())
      newErrors.password = 'Password is required'

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = 'Confirm Password is required'

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)

      const data = await authServices.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'patient'
      })

      login(data.user, data.token.accessToken, data.token.refreshToken)

      navigate('/doctors', {
        replace: true
      })

    } catch (err) {

      const message = err.response?.data?.message

      if (Array.isArray(message)) {

        const backendErrors = {}

        message.forEach(error => {

          if (error.toLowerCase().includes('name'))
            backendErrors.name = error

          if (error.toLowerCase().includes('phone'))
            backendErrors.phone = error

          if (error.toLowerCase().includes('email'))
            backendErrors.email = error

          if (error.toLowerCase().includes('password'))
            backendErrors.password = error

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
    <form onSubmit={handleSubmit} className="auth-form">
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
          Create your account to get started
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

        {/* Name */}
        <div className="auth-field">
          <label className="auth-label">Full Name</label>
          <div className="auth-input-wrapper">
            <FiUser className="auth-input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className={`auth-input ${errors.name ? 'auth-input-error' : ''}`}
            />
          </div>
          {errors.name && <p className="auth-error-text">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div className="auth-field">
          <label className="auth-label">Phone</label>
          <div className="auth-input-wrapper">
            <FiPhone className="auth-input-icon" />
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className={`auth-input ${errors.phone ? 'auth-input-error' : ''}`}
            />
          </div>
          {errors.phone && <p className="auth-error-text">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="auth-field">
          <label className="auth-label">Email</label>
          <div className="auth-input-wrapper">
            <FiMail className="auth-input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`auth-input auth-input-password ${errors.password ? 'auth-input-error' : ''}`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="auth-toggle-password">
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && <p className="auth-error-text">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="auth-field">
          <label className="auth-label">Confirm Password</label>
          <div className="auth-input-wrapper">
            <FiLock className="auth-input-icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`auth-input auth-input-password ${errors.confirmPassword ? 'auth-input-error' : ''}`}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="auth-toggle-password">
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.confirmPassword && <p className="auth-error-text">{errors.confirmPassword}</p>}
        </div>



        {/* Submit */}
        <button type="submit" disabled={loading} className="auth-submit-btn">
          {loading ? 'Creating Account...' : 'Create Account'}
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

        {/* Login link */}
        <p className="auth-footer-text">
          Already have an account?
          <Link to="/login" className="auth-footer-link">Sign In</Link>
        </p>
      </div>
    </form>
  )
}

export default RegisterForm