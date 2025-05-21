// app/payment/callback/page.tsx

import { Suspense } from 'react'
import PaymentCallback from '@/components/PaymentCallback' // or wherever your component is

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentCallback />
        </Suspense>
    )
}
