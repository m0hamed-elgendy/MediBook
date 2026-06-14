import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    )

    const [token, setToken] = useState(
        localStorage.getItem('token') || null
    )

    const login = (userData, accessToken) => {
        setUser(userData),
            setToken(accessToken),
            localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', accessToken)
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token')
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