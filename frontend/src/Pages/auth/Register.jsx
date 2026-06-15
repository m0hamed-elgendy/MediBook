import React from 'react'
import RegisterForm from '../../components/auth/RegisterForm'
import AuthBanner from '../../components/auth/AuthBanner'

const Register = () => {
  return (
    <div className="auth-page">
      <AuthBanner />
      <div className="auth-form-panel">
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register