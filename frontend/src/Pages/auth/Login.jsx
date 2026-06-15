import LoginForm from '../../components/auth/LoginForm'
import AuthBanner from '../../components/auth/AuthBanner'

const Login = () => {
  return (
    <div className="auth-page">
      <AuthBanner />
      <div className="auth-form-panel">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login