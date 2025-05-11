export default function PaymentsPage() {
    return (
      <div>
        <h1 className="text-4xl font-bold text-teal-900 mb-6">Payments API</h1>
  
        <div className="prose max-w-none text-gray-700">
          <p className="mb-6">
            The Payments API allows you to process payments for bookings, manage refunds, and track payment status.
          </p>
  
          <div className="bg-white p-6 rounded-lg border mb-8 shadow-lg">
            <h3 className="text-lg font-semibold text-teal-900 mb-2">Base URL</h3>
            <p className="text-gray-600 font-mono">https://api.yourdomain.com/v1/payments</p>
          </div>
  
          <h2 className="text-2xl font-bold text-teal-900 mb-4">Endpoints</h2>
  
          <div className="space-y-8">
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="text-xl font-semibold text-teal-900 mb-2">Create Payment</h3>
              <p className="text-gray-600 mb-2">Creates a payment for a booking.</p>
              <p className="font-mono text-sm mb-2">POST /payments</p>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Request Body</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                  <pre>{`{
    "bookingId": "bkg_54321",
    "paymentMethod": "credit_card",
    "paymentDetails": {
      "cardNumber": "4111111111111111",
      "expiryMonth": "12",
      "expiryYear": "2025",
      "cvv": "123",
      "cardholderName": "John Doe"
    },
    "billingAddress": {
      "line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    }
  }`}</pre>
                </div>
              </div>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Response</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`{
    "id": "pmt_98765",
    "bookingId": "bkg_54321",
    "amount": 949.95,
    "currency": "USD",
    "status": "succeeded",
    "paymentMethod": "credit_card",
    "paymentMethodDetails": {
      "type": "credit_card",
      "card": {
        "brand": "visa",
        "last4": "1111",
        "expiryMonth": "12",
        "expiryYear": "2025"
      }
    },
    "receiptUrl": "https://api.yourdomain.com/v1/payments/pmt_98765/receipt",
    "createdAt": "2023-05-11T12:05:00Z"
  }`}</pre>
                </div>
              </div>
            </div>
  
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="text-xl font-semibold text-teal-900 mb-2">Get Payment</h3>
              <p className="text-gray-600 mb-2">Retrieves a payment by ID.</p>
              <p className="font-mono text-sm mb-2">GET /payments/{"{paymentId}"}</p>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Response</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`{
    "id": "pmt_98765",
    "bookingId": "bkg_54321",
    "amount": 949.95,
    "currency": "USD",
    "status": "succeeded",
    "paymentMethod": "credit_card",
    "paymentMethodDetails": {
      "type": "credit_card",
      "card": {
        "brand": "visa",
        "last4": "1111",
        "expiryMonth": "12",
        "expiryYear": "2025"
      }
    },
    "receiptUrl": "https://api.yourdomain.com/v1/payments/pmt_98765/receipt",
    "createdAt": "2023-05-11T12:05:00Z"
  }`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  