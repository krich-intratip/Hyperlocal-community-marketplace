import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import PaymentPageContent from './_payment-page'

export default function CheckoutPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  )
}
