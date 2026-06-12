import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<h1>Home</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}

export default AppRoutes