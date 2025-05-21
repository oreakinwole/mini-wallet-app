// Authentication utility functions
import { refreshToken } from './api'

// Store tokens in localStorage
export const storeTokens = (accessToken: string, refreshToken: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
    }
}

// Remove tokens from localStorage
export const removeTokens = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
    }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
        return !!localStorage.getItem('token')
    }
    return false
}

// Get the refresh token
export const getRefreshToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('refreshToken')
    }
    return null
}

// Handle token refresh
export const handleTokenRefresh = async (): Promise<boolean> => {
    const refreshTokenValue = getRefreshToken()

    if (!refreshTokenValue) {
        return false
    }

    try {
        const response = await refreshToken(refreshTokenValue)
        if (response.access) {
            localStorage.setItem('token', response.access)
            return true
        }
        return false
    } catch (error) {
        removeTokens()
        return false
    }
}
