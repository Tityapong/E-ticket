export default function AuthenticationPage() {
    return (
      <div>
        <h1 className="text-4xl font-bold text-teal-900 mb-6">Authentication</h1>
  
        <div className="prose max-w-none text-gray-700">
          <p className="mb-6">
            Authentication to the API is performed via Bearer Token. You will need to include your API key in the
            Authorization header of your requests.
          </p>
  
          <div className="bg-white p-6 rounded-lg border mb-8 shadow-lg">
            <h3 className="text-lg font-semibold text-teal-900 mb-2">API Key Security</h3>
            <p className="text-gray-600">
              Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in
              publicly accessible areas such as GitHub, client-side code, etc.
            </p>
          </div>
  
          <h2 className="text-xl font-semibold text-teal-900 mt-8 mb-4">Authentication Example</h2>
  
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
            <pre>{`// Example using fetch API
  fetch('https://api.yourdomain.com/v1/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  })
  .then(response => response.json())
  .then(data => console.log(data));`}</pre>
          </div>
  
          <h2 className="text-xl font-semibold text-teal-900 mt-8 mb-4">Response Codes</h2>
  
          <table className="min-w-full bg-white rounded-lg overflow-hidden border mb-8">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Status Code</th>
                <th className="py-3 px-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-3 px-4">200 - OK</td>
                <td className="py-3 px-4">Everything worked as expected</td>
              </tr>
              <tr className="border-t bg-gray-50">
                <td className="py-3 px-4">400 - Bad Request</td>
                <td className="py-3 px-4">The request was unacceptable, often due to missing a required parameter</td>
              </tr>
              <tr className="border-t">
                <td className="py-3 px-4">401 - Unauthorized</td>
                <td className="py-3 px-4">No valid API key provided</td>
              </tr>
              <tr className="border-t bg-gray-50">
                <td className="py-3 px-4">403 - Forbidden</td>
                <td className="py-3 px-4">The API key does not have permissions to perform the request</td>
              </tr>
              <tr className="border-t">
                <td className="py-3 px-4">404 - Not Found</td>
                <td className="py-3 px-4">The requested resource does not exist</td>
              </tr>
              <tr className="border-t bg-gray-50">
                <td className="py-3 px-4">429 - Too Many Requests</td>
                <td className="py-3 px-4">Too many requests hit the API too quickly</td>
              </tr>
              <tr className="border-t">
                <td className="py-3 px-4">500, 502, 503, 504 - Server Errors</td>
                <td className="py-3 px-4">Something went wrong on our end</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  