'use client'

import type React from 'react'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getWalletDetails, initiateWalletFunding, type WalletData, type Transaction } from '@/lib/api'
import { isAuthenticated, removeTokens, handleTokenRefresh } from '@/lib/auth'

export default function Dashboard() {
    const router = useRouter()
    const [walletData, setWalletData] = useState<WalletData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showFundModal, setShowFundModal] = useState(false)
    const [fundAmount, setFundAmount] = useState('')
    const [processingPayment, setProcessingPayment] = useState(false)

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            router.push('/login')
            return
        }

        // Fetch wallet data
        fetchWalletData()
    }, [router])

    const fetchWalletData = async () => {
        setLoading(true)
        setError('')

        try {
            const data = await getWalletDetails()

            console.log('Wallet data:', data)

            setWalletData({
                ...data,
                balance: Number(data.balance),
            })
        } catch (err) {
            console.error('Error fetching wallet data:', err)

            if (err instanceof Error && err.message === 'Authentication expired') {
                // Try to refresh the token
                const refreshed = await handleTokenRefresh()
                if (refreshed) {
                    // Try again with the new token
                    try {
                        const data = await getWalletDetails()
                        setWalletData({
                            ...data,
                            balance: Number(data.balance),
                        })
                    } catch (refreshErr) {
                        handleAuthError(refreshErr)
                    }
                } else {
                    // Redirect to login if refresh failed
                    router.push('/login')
                }
            } else {
                handleAuthError(err)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleAuthError = (err: unknown) => {
        if (err instanceof Error) {
            setError(err.message)
            if (err.message === 'Authentication required' || err.message === 'Authentication expired') {
                removeTokens()
                router.push('/login')
            }
        } else {
            setError('An error occurred while fetching wallet data')
        }
    }

    const handleLogout = () => {
        removeTokens()
        router.push('/login')
    }

    const handleFundWallet = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!fundAmount || Number.parseFloat(fundAmount) <= 0) {
            return
        }

        setProcessingPayment(true)
        setError('')

        try {
            // Call the API to initiate wallet funding
            const response = await initiateWalletFunding(Number.parseFloat(fundAmount))

            // Redirect to Monnify checkout page
            window.location.href = response.checkoutUrl
        } catch (err) {
            console.error('Error initiating payment:', err)
            if (err instanceof Error) {
                setError(err.message)

                if (err.message === 'Authentication expired' || err.message === 'Authentication required') {
                    // Try to refresh the token
                    const refreshed = await handleTokenRefresh()
                    if (!refreshed) {
                        removeTokens()
                        router.push('/login')
                    }
                }
            } else {
                setError('Failed to initiate payment')
            }
            setProcessingPayment(false)
        }
    }

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                        >
                            <path d="M18 7V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v3" />
                            <path d="M18 14v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3" />
                            <rect width="18" height="10" x="3" y="7" rx="2" />
                        </svg>
                        <span className="text-xl font-bold">WalletApp</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="flex-1 py-6">
                <div className="container px-4 md:px-6">
                    {error && (
                        <div className="mb-6 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                            <button onClick={fetchWalletData} className="ml-2 underline">
                                Try again
                            </button>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="col-span-2 space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                                <p className="text-gray-500">Manage your wallet and view your transaction history.</p>
                            </div>
                            <div className="rounded-lg border bg-card p-6 shadow-sm">
                                <div className="flex flex-col space-y-2">
                                    <h2 className="text-xl font-semibold">Wallet Balance</h2>
                                    {loading ? (
                                        <div className="h-8 w-32 animate-pulse rounded-md bg-muted"></div>
                                    ) : (
                                        <p className="text-3xl font-bold">₦{walletData?.balance.toFixed(2) || '0.00'}</p>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => setShowFundModal(true)}
                                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Fund Wallet
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-card shadow-sm">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold">Transaction History</h2>
                                </div>
                                <div className="p-0">
                                    {loading ? (
                                        <div className="space-y-2 p-6">
                                            <div className="h-12 animate-pulse rounded-md bg-muted"></div>
                                            <div className="h-12 animate-pulse rounded-md bg-muted"></div>
                                            <div className="h-12 animate-pulse rounded-md bg-muted"></div>
                                        </div>
                                    ) : !walletData || walletData.transactions.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-6 text-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-12 w-12 text-gray-400"
                                            >
                                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                                <line x1="2" x2="22" y1="10" y2="10" />
                                            </svg>
                                            <h3 className="mt-4 text-lg font-medium">No transactions yet</h3>
                                            <p className="mt-2 text-sm text-gray-500">Fund your wallet to see your transactions here.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b bg-muted/50 text-sm font-medium">
                                                        <th className="px-6 py-3 text-left">Date</th>
                                                        <th className="px-6 py-3 text-left">Description</th>
                                                        <th className="px-6 py-3 text-right">Amount</th>
                                                        <th className="px-6 py-3 text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {walletData.transactions.map((transaction: Transaction) => (
                                                        <tr key={transaction.id} className="border-b">
                                                            <td className="px-6 py-4 text-sm">{formatDate(transaction.created_at)}</td>
                                                            <td className="px-6 py-4 text-sm">{transaction.description}</td>
                                                            <td
                                                                className={`px-6 py-4 text-right text-sm ${
                                                                    transaction.transaction_type === 'credit'
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }`}
                                                            >
                                                                {transaction.transaction_type === 'credit' ? '+' : '-'}₦
                                                                {/* {transaction.amount.toFixed(2)} */}
                                                                {transaction.amount}
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-sm">
                                                                <span
                                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                        transaction.status === 'successful'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : transaction.status === 'pending'
                                                                              ? 'bg-yellow-100 text-yellow-800'
                                                                              : 'bg-red-100 text-red-800'
                                                                    }`}
                                                                >
                                                                    {transaction.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="rounded-lg border bg-card p-6 shadow-sm">
                                <h2 className="text-xl font-semibold">Quick Actions</h2>
                                <div className="mt-4 space-y-2">
                                    <button
                                        onClick={() => setShowFundModal(true)}
                                        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Fund Wallet
                                    </button>
                                    <button
                                        onClick={fetchWalletData}
                                        className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Refresh Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Fund Wallet Modal */}
            {showFundModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
                        <h2 className="text-xl font-semibold">Fund Your Wallet</h2>
                        <p className="mt-2 text-sm text-gray-500">Enter the amount you want to add to your wallet.</p>
                        <form onSubmit={handleFundWallet} className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="amount"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Amount (₦)
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    min="100"
                                    step="100"
                                    placeholder="1000"
                                    required
                                    value={fundAmount}
                                    onChange={(e) => setFundAmount(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowFundModal(false)
                                        setError('')
                                    }}
                                    className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingPayment || !fundAmount || Number.parseFloat(fundAmount) <= 0}
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                >
                                    {processingPayment ? 'Processing...' : 'Proceed to Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
