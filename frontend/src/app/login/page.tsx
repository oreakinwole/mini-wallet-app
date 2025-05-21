import React, { Suspense } from 'react'
import Link from 'next/link'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
    return (
        <div>
            <Suspense fallback={<div>Loading login...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
