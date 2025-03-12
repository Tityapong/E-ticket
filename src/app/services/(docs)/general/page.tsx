export default function DocumentationPage() {
    return (
      <div className="flex min-h-screen ">
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-teal-900 mb-6">API Integration</h1>
  
          <div className="prose max-w-none text-gray-700">
            <p className="mb-6">
              PayWay APIs are provided as REST and have predictable, resource-oriented URLs. It uses HTTP response codes
              to indicate API errors. In order to call our APIs, you need to pass authentication in the form of a merchant
              key and authorization header. Values for both the merchant key and Authorization header are made available via
              email used at the time of registration.
            </p>
  
            <p className="mb-6">
              The API allows you to interact securely from a client-side application. We return JSON for all API responses,
              including specific error messages.
            </p>
  
            <h2 className="text-xl font-semibold text-teal-900 mt-8 mb-4">
              Here you will find all the APIs provided by PayWay for different functions like:
            </h2>
  
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="font-medium">create transaction</span>
                <span className="text-gray-600">- create a transaction in PayWay</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="font-medium">check transaction</span>
                <span className="text-gray-600">- check a transaction in PayWay</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="font-medium">get transaction</span>
                <span className="text-gray-600">- get a list of transactions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="font-medium">push back notification transaction</span>
              </li>
            </ul>
  
            <div className="bg-white p-6 rounded-lg border mb-8 shadow-lg">
              <p className="text-gray-600">
                Every time you use the above APIs, you will have to pass authentication. You can authenticate your account
                by including your secret key and applying encryption mechanisms in API requests. Your API keys manage many
                privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas
                on any online source code version control, online drive share, client-side code, etc.
              </p>
            </div>
  
            <p className="text-gray-600 mb-8">
              Authentication to the API is performed via HTTP Basic Auth. Provide your API key as the basic auth value. You
              do not need to provide a username or password.
            </p>
  
            <h2 className="text-2xl font-bold text-teal-900 mb-4">API URL</h2>
            <p className="text-gray-600 mb-2">The APIs are accessible from the URL:</p>
            <p className="text-gray-600 font-mono bg-gray-100 p-4 rounded-lg">
              Testing Server base url:
              <br />
              <span className="text-teal-600">
                https://sandbox.payway.com.kh/sandbox/api/{`{merchant_api_name}`} /
              </span>
            </p>
            <p className="text-gray-600 font-mono bg-gray-100 p-4 rounded-lg mt-4">
              Production Server base url:
              <br />
              <span className="text-teal-600">
                https://payway.ababank.com/api/{`{merchant_api_name}`} /
              </span>
            </p>
          </div>
        </main>
      </div>
    );
  }
  