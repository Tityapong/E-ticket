export default function OverviewPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-teal-900 mb-6">API Documentation</h1>

      <div className="prose max-w-none text-gray-700">
        <p className="mb-6">
          Our APIs are provided as REST and have predictable, resource-oriented URLs. They use HTTP response codes to
          indicate API errors. In order to call our APIs, you need to pass authentication in the form of an API key in
          the authorization header.
        </p>

        <p className="mb-6">
          The API allows you to interact securely from a client-side application. We return JSON for all API responses,
          including specific error messages.
        </p>

        <h2 className="text-xl font-semibold text-teal-900 mt-8 mb-4">Our API provides comprehensive endpoints for:</h2>

        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="font-medium">User Management</span>
            <span className="text-gray-600">- create, update, and manage user accounts</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="font-medium">Event Management</span>
            <span className="text-gray-600">- create and manage events</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="font-medium">Tickets</span>
            <span className="text-gray-600">- manage ticket types and availability</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="font-medium">Booking System</span>
            <span className="text-gray-600">- handle reservations and bookings</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="font-medium">Payments</span>
            <span className="text-gray-600">- process and manage payments</span>
          </li>
        </ul>

        <div className="bg-white p-6 rounded-lg border mb-8 shadow-lg">
          <p className="text-gray-600">
            Every time you use our APIs, you will have to pass authentication. You can authenticate your account by
            including your API key in the authorization header. Your API keys manage many privileges, so be sure to keep
            them secure! Do not share your API keys in publicly accessible areas such as GitHub, client-side code, etc.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-teal-900 mb-4">API URL</h2>
        <p className="text-gray-600 mb-2">The APIs are accessible from the URL:</p>
        <p className="text-gray-600 font-mono bg-gray-100 p-4 rounded-lg">
          Development Environment:
          <br />
          <span className="text-teal-600">https://api-dev.yourdomain.com/v1/</span>
        </p>
        <p className="text-gray-600 font-mono bg-gray-100 p-4 rounded-lg mt-4">
          Production Environment:
          <br />
          <span className="text-teal-600">https://api.yourdomain.com/v1/</span>
        </p>
      </div>
    </div>
  )
}
