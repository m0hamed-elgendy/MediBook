import LoginForm from '../../components/auth/LoginForm'
import AuthBanner from '../../components/auth/AuthBanner'

const Login = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <AuthBanner />
      <div className="flex-1 bg-white flex items-center justify-center p-8 overflow-y-auto lg:shadow-none shadow-2xl">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login