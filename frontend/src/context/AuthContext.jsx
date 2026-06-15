import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    )

    const [token, setToken] = useState(
        localStorage.getItem('token') || null
    )
    const[refreshToken,setRefreshToken]=useState(
        localStorage.getItem('refreshToken')|| null
    )

    const login = (userData, accessToken,refreshToken) => {
        setUser(userData)
        setToken(accessToken)
        setRefreshToken(refreshToken)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export function useAuth() {
    return useContext(AuthContext)
}