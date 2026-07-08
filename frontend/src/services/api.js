import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    },
})

// Request interceptor to attach bearer token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

// Response interceptor to handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If the error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Check if this request is already a refresh request to prevent infinite loops
            if (originalRequest.url === '/auth/refresh') {
                return Promise.reject(error)
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return api(originalRequest)
                    })
                    .catch(err => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) {
                isRefreshing = false
                // No refresh token, trigger logout / redirect
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
                return Promise.reject(error)
            }

            try {
                // Call refresh endpoint using a clean axios instance to avoid interceptor recursion
                const response = await axios.post('http://localhost:3000/api/auth/refresh', {
                    refreshToken
                })

                const { accessToken, refreshToken: newRefreshToken } = response.data

                localStorage.setItem('token', accessToken)
                localStorage.setItem('refreshToken', newRefreshToken)

                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                originalRequest.headers.Authorization = `Bearer ${accessToken}`

                processQueue(null, accessToken)
                isRefreshing = false

                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                isRefreshing = false

                // If refresh token is expired or invalid, log out the user
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'

                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
