export default function UserManagementPage() {
    return (
      <div>
        <h1 className="text-4xl font-bold text-teal-900 mb-6">User Management API</h1>
  
        <div className="prose max-w-none text-gray-700">
          <p className="mb-6">
            The User Management API allows you to create, read, update, and delete user accounts in your system. You can
            also manage user roles, permissions, and authentication.
          </p>
  
          <div className="bg-white p-6 rounded-lg border mb-8 shadow-lg">
            <h3 className="text-lg font-semibold text-teal-900 mb-2">Base URL</h3>
            <p className="text-gray-600 font-mono">https://api.yourdomain.com/v1/users</p>
          </div>
  
          <h2 className="text-2xl font-bold text-teal-900 mb-4">Endpoints</h2>
  
          <div className="space-y-8">
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="text-xl font-semibold text-teal-900 mb-2">Create User</h3>
              <p className="text-gray-600 mb-2">Creates a new user account.</p>
              <p className="font-mono text-sm mb-2">POST /users</p>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Request Body</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                  <pre>{`{
    "email": "user@example.com",
    "password": "securepassword",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  }`}</pre>
                </div>
              </div>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Response</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`{
    "id": "usr_123456789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "createdAt": "2023-05-11T12:00:00Z"
  }`}</pre>
                </div>
              </div>
            </div>
  
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="text-xl font-semibold text-teal-900 mb-2">Get User</h3>
              <p className="text-gray-600 mb-2">Retrieves a user by ID.</p>
              <p className="font-mono text-sm mb-2">GET /users/{"{userId}"}</p>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Response</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`{
    "id": "usr_123456789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "createdAt": "2023-05-11T12:00:00Z",
    "updatedAt": "2023-05-11T12:00:00Z"
  }`}</pre>
                </div>
              </div>
            </div>
  
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="text-xl font-semibold text-teal-900 mb-2">Update User</h3>
              <p className="text-gray-600 mb-2">Updates an existing user is information.</p>
              <p className="font-mono text-sm mb-2">PUT /users/{"{userId}"}</p>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Request Body</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                  <pre>{`{
    "firstName": "Johnny",
    "lastName": "Doe",
    "role": "admin"
  }`}</pre>
                </div>
              </div>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Response</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`{
    "id": "usr_123456789",
    "email": "user@example.com",
    "firstName": "Johnny",
    "lastName": "Doe",
    "role": "admin",
    "createdAt": "2023-05-11T12:00:00Z",
    "updatedAt": "2023-05-11T13:30:00Z"
  }`}</pre>
                </div>
              </div>
            </div>
  
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="text-xl font-semibold text-teal-900 mb-2">Delete User</h3>
              <p className="text-gray-600 mb-2">Deletes a user account.</p>
              <p className="font-mono text-sm mb-2">DELETE /users/{"{userId}"}</p>
  
              <div className="mt-4">
                <h4 className="font-medium text-teal-900 mb-2">Response</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`{
    "success": true,
    "message": "User deleted successfully"
  }`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  