// API base URL - use environment variable or default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Rest of your API code...

// Types
export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    email: string
    username?: string
    password: string
}

export interface AuthResponse {
    access: string
    refresh: string
}

export interface WalletData {
    id: number
    balance: number
    transactions: Transaction[]
    created_at: string
    updated_at: string
}
export interface Transaction {
    id: number
    amount: number
    transaction_type: 'credit' | 'debit'
    status: 'pending' | 'successful' | 'failed'
    reference: string
    description: string
    created_at: string
}

export interface FundWalletResponse {
    checkoutUrl: string
    transactionReference: string
}

// Helper function to get the JWT token from localStorage
const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token')
    }
    return null
}

// API functions
export const registerUser = async (userData: RegisterData): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Registration failed')
    }

    return response.json()
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Login failed')
    }

    const data = await response.json()
    return data
}

export const getWalletDetails = async (): Promise<WalletData> => {
    const token = getToken()
    if (!token) {
        throw new Error('Authentication required')
    }

    const response = await fetch(`${API_BASE_URL}/wallet/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        if (response.status === 401) {
            // Token expired or invalid
            throw new Error('Authentication expired')
        }
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to fetch wallet details')
    }

    return response.json()
}

export const initiateWalletFunding = async (amount: number): Promise<FundWalletResponse> => {
    const token = getToken()
    if (!token) {
        throw new Error('Authentication required')
    }

    const response = await fetch(`${API_BASE_URL}/wallet/fund/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
    })

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication expired')
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to initiate wallet funding')
    }

    return response.json()
}

export const refreshToken = async (refreshToken: string): Promise<{ access: string }> => {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
        throw new Error('Failed to refresh token')
    }

    return response.json()
}
