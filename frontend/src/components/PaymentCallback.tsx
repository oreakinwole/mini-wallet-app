'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        // Get payment status from URL parameters
        const paymentStatus = searchParams.get('paymentStatus')
        const paymentReference = searchParams.get('paymentReference')

        if (!paymentReference) {
            setStatus('failed')
            setMessage('Invalid payment reference')
            return
        }

        if (paymentStatus === 'PAID') {
            setStatus('success')
            setMessage('Payment successful! Your wallet has been credited.')
        } else {
            setStatus('failed')
            setMessage('Payment failed or was cancelled. Please try again.')
        }

        // In a real app, you might want to verify the payment status with your backend
        // This would be especially important for security reasons
        // const verifyPayment = async () => {
        //   try {
        //     const token = localStorage.getItem('token')
        //     const response = await fetch(`/api/verify-payment?reference=${paymentReference}`, {
        //       headers: { Authorization: `Bearer ${token}` }
        //     })
        //     const data = await response.json()
        //
        //     if (data.verified) {
        //       setStatus("success")
        //       setMessage("Payment verified! Your wallet has been credited.")
        //     } else {
        //       setStatus("failed")
        //       setMessage("Payment verification failed. Please contact support.")
        //     }
        //   } catch (error) {
        //     console.error('Error verifying payment:', error)
        //     setStatus("failed")
        //     setMessage("Error verifying payment. Please check your dashboard.")
        //   }
        // }
        //
        // verifyPayment()

        // Redirect to dashboard after a delay
        const timer = setTimeout(() => {
            router.push('/dashboard')
        }, 5000)

        return () => clearTimeout(timer)
    }, [searchParams, router])

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b">
                <div className="container flex h-16 items-center px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2">
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
                </div>
            </header>
            <main className="flex flex-1 items-center justify-center p-6">
                <div className="mx-auto max-w-md text-center">
                    {status === 'loading' && (
                        <>
                            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <h1 className="text-2xl font-bold">Processing Payment</h1>
                            <p className="mt-2 text-gray-500">Please wait while we verify your payment...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
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
                                    className="h-6 w-6 text-green-600"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-green-600">Payment Successful</h1>
                            <p className="mt-2 text-gray-500">{message}</p>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
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
                                    className="h-6 w-6 text-red-600"
                                >
                                    <path d="m18 6-12 12" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
                            <p className="mt-2 text-gray-500">{message}</p>
                        </>
                    )}

                    <p className="mt-4 text-sm text-gray-500">Redirecting to dashboard in a few seconds...</p>
                    <div className="mt-6">
                        <Link
                            href="/dashboard"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
