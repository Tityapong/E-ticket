export default function TicketsPage() {
    return (
      <div>
        <h1 className="text-4xl font-bold text-teal-900 mb-6">Tickets API</h1>
  
        <div className="prose max-w-none text-gray-700">
          <p className="mb-6">
            The Tickets API allows you to create and manage ticket types for events, control ticket availability, and
            track ticket sales.
          </p>
  
          <div className="bg-white p-6 rounded-lg border mb-8 shadow-lg">
            <h3 className="text-lg font-semibold text-teal-900 mb-2">Base URL</h3>
            <p className="text-gray-600 font-mono">https://api.yourdomain.com/v1/tickets</p>
          </div>
  
          <h2 className="text-2xl font-bold text-teal-900 mb-4">Endpoints</h2>
  
          <div className="space-y-8">
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="text-xl font-semibold text-teal-900 mb-2">Create Ticket Type</h3>
              <p className="text-gray-600 mb-2">Creates a new ticket type for an event.</p>
              <p className="font-mono text-sm mb-2">POST /events/{"{eventId}"}/ticket-types</p>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Request Body</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                  <pre>{`{
    "name": "VIP Pass",
    "description": "Access to VIP areas and complimentary drinks",
    "price": 299.99,
    "quantity": 500,
    "saleStartDate": "2023-05-15T00:00:00Z",
    "saleEndDate": "2023-07-14T23:59:59Z",
    "maxPerTransaction": 4
  }`}</pre>
                </div>
              </div>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Response</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`{
    "id": "tkt_12345",
    "eventId": "evt_987654321",
    "name": "VIP Pass",
    "description": "Access to VIP areas and complimentary drinks",
    "price": 299.99,
    "quantity": 500,
    "quantityAvailable": 500,
    "saleStartDate": "2023-05-15T00:00:00Z",
    "saleEndDate": "2023-07-14T23:59:59Z",
    "maxPerTransaction": 4,
    "createdAt": "2023-05-11T12:00:00Z"
  }`}</pre>
                </div>
              </div>
            </div>
  
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="text-xl font-semibold text-teal-900 mb-2">Get Ticket Types</h3>
              <p className="text-gray-600 mb-2">Retrieves all ticket types for an event.</p>
              <p className="font-mono text-sm mb-2">GET /events/{"{eventId}"}/ticket-types</p>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Response</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`{
    "data": [
      {
        "id": "tkt_12345",
        "eventId": "evt_987654321",
        "name": "VIP Pass",
        "description": "Access to VIP areas and complimentary drinks",
        "price": 299.99,
        "quantity": 500,
        "quantityAvailable": 500,
        "saleStartDate": "2023-05-15T00:00:00Z",
        "saleEndDate": "2023-07-14T23:59:59Z",
        "maxPerTransaction": 4
      },
      {
        "id": "tkt_67890",
        "eventId": "evt_987654321",
        "name": "General Admission",
        "description": "Standard festival access",
        "price": 149.99,
        "quantity": 4000,
        "quantityAvailable": 3750,
        "saleStartDate": "2023-05-01T00:00:00Z",
        "saleEndDate": "2023-07-14T23:59:59Z",
        "maxPerTransaction": 8
      }
    ]
  }`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  