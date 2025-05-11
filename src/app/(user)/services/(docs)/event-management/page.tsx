export default function EventManagementPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-teal-900 mb-6">Event Management API</h1>

      <div className="prose max-w-none text-gray-700">
        <p className="mb-6">
          The Event Management API allows you to create and manage events, including scheduling, venue information, and
          event details.
        </p>

        <div className="bg-white p-6 rounded-lg border mb-8 shadow-lg">
          <h3 className="text-lg font-semibold text-teal-900 mb-2">Base URL</h3>
          <p className="text-gray-600 font-mono">https://api.yourdomain.com/v1/events</p>
        </div>

        <h2 className="text-2xl font-bold text-teal-900 mb-4">Endpoints</h2>

        <div className="space-y-8">
          <div className="border-l-4 border-teal-500 pl-4">
            <h3 className="text-xl font-semibold text-teal-900 mb-2">Create Event</h3>
            <p className="text-gray-600 mb-2">Creates a new event.</p>
            <p className="font-mono text-sm mb-2">POST /events</p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">Request Body</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                <pre>{`{
  "title": "Summer Music Festival",
  "description": "A three-day music festival featuring top artists",
  "startDate": "2023-07-15T10:00:00Z",
  "endDate": "2023-07-17T22:00:00Z",
  "location": {
    "name": "Central Park",
    "address": "123 Park Avenue",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "category": "music",
  "capacity": 5000,
  "isPublic": true
}`}</pre>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`{
  "id": "evt_987654321",
  "title": "Summer Music Festival",
  "description": "A three-day music festival featuring top artists",
  "startDate": "2023-07-15T10:00:00Z",
  "endDate": "2023-07-17T22:00:00Z",
  "location": {
    "name": "Central Park",
    "address": "123 Park Avenue",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "category": "music",
  "capacity": 5000,
  "isPublic": true,
  "createdAt": "2023-05-11T12:00:00Z"
}`}</pre>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-teal-500 pl-4">
            <h3 className="text-xl font-semibold text-teal-900 mb-2">Get Events</h3>
            <p className="text-gray-600 mb-2">Retrieves a list of events with optional filtering.</p>
            <p className="font-mono text-sm mb-2">GET /events</p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">Query Parameters</h4>
              <table className="min-w-full bg-white rounded-lg overflow-hidden border mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Parameter</th>
                    <th className="py-2 px-4 text-left">Type</th>
                    <th className="py-2 px-4 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-2 px-4">category</td>
                    <td className="py-2 px-4">string</td>
                    <td className="py-2 px-4">Filter by event category</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="py-2 px-4">startDate</td>
                    <td className="py-2 px-4">string (ISO date)</td>
                    <td className="py-2 px-4">Filter events starting after this date</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 px-4">endDate</td>
                    <td className="py-2 px-4">string (ISO date)</td>
                    <td className="py-2 px-4">Filter events ending before this date</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="py-2 px-4">limit</td>
                    <td className="py-2 px-4">integer</td>
                    <td className="py-2 px-4">Number of events to return (default: 20, max: 100)</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 px-4">offset</td>
                    <td className="py-2 px-4">integer</td>
                    <td className="py-2 px-4">Number of events to skip (for pagination)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`{
  "data": [
    {
      "id": "evt_987654321",
      "title": "Summer Music Festival",
      "description": "A three-day music festival featuring top artists",
      "startDate": "2023-07-15T10:00:00Z",
      "endDate": "2023-07-17T22:00:00Z",
      "location": {
        "name": "Central Park",
        "city": "New York",
        "state": "NY",
        "country": "USA"
      },
      "category": "music"
    },
    // More events...
  ],
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
