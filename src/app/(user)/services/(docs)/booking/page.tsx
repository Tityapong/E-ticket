export default function BookingPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-teal-900 mb-6">
        Booking System API
      </h1>

      <div className="prose max-w-none text-gray-700">
        <p className="mb-6">
          The Booking System API allows you to create and manage bookings,
          including reserving tickets, managing seat assignments, and handling
          booking confirmations.
        </p>

        <div className="bg-white p-6 rounded-lg border mb-8 shadow-lg">
          <h3 className="text-lg font-semibold text-teal-900 mb-2">Base URL</h3>
          <p className="text-gray-600 font-mono">
            https://api.yourdomain.com/v1/bookings
          </p>
        </div>

        <h2 className="text-2xl font-bold text-teal-900 mb-4">Endpoints</h2>

        <div className="space-y-8">
          <div className="border-l-4 border-teal-500 pl-4">
            <h3 className="text-xl font-semibold text-teal-900 mb-2">
              Create Booking
            </h3>
            <p className="text-gray-600 mb-2">
              Creates a new booking for an event.
            </p>
            <p className="font-mono text-sm mb-2">POST /bookings</p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">Request Body</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                <pre>{`{
  "userId": "usr_123456789",
  "eventId": "evt_987654321",
  "tickets": [
    {
      "ticketTypeId": "tkt_12345",
      "quantity": 2
    },
    {
      "ticketTypeId": "tkt_67890",
      "quantity": 3
    }
  ],
  "customerInfo": {
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }
}`}</pre>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`{
  "id": "bkg_54321",
  "userId": "usr_123456789",
  "eventId": "evt_987654321",
  "status": "pending_payment",
  "tickets": [
    {
      "ticketTypeId": "tkt_12345",
      "name": "VIP Pass",
      "quantity": 2,
      "unitPrice": 249.99,
      "subtotal": 499.98
    },
    {
      "ticketTypeId": "tkt_67890",
      "name": "General Admission",
      "quantity": 3,
      "unitPrice": 149.99,
      "subtotal": 449.97
    }
  ],
  "customerInfo": {
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  },
  "totalAmount": 949.95,
  "createdAt": "2023-05-11T12:00:00Z",
  "expiresAt": "2023-05-11T12:15:00Z",
  "paymentUrl": "https://api.yourdomain.com/v1/payments/bkg_54321"
}`}</pre>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-teal-500 pl-4">
            <h3 className="text-xl font-semibold text-teal-900 mb-2">
              Get Booking
            </h3>
            <p className="text-gray-600 mb-2">Retrieves a booking by ID.</p>
            <p className="font-mono text-sm mb-2">
              GET /bookings/{"{bookingId}"}
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`{
  "id": "bkg_54321",
  "userId": "usr_123456789",
  "eventId": "evt_987654321",
  "status": "confirmed",
  "tickets": [
    {
      "ticketTypeId": "tkt_12345",
      "name": "VIP Pass",
      "quantity": 2,
      "unitPrice": 249.99,
      "subtotal": 499.98,
      "ticketIds": ["tckt_111", "tckt_112"]
    },
    {
      "ticketTypeId": "tkt_67890",
      "name": "General Admission",
      "quantity": 3,
      "unitPrice": 149.99,
      "subtotal": 449.97,
      "ticketIds": ["tckt_113", "tckt_114", "tckt_115"]
    }
  ],
  "customerInfo": {
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  },
  "totalAmount": 949.95,
  "paymentId": "pmt_98765",
  "createdAt": "2023-05-11T12:00:00Z",
  "confirmedAt": "2023-05-11T12:05:30Z"
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
