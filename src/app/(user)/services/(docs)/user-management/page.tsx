"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserManagementPage() {
  const baseUrl = "https://etickets.ticket.publicvm.com/api";

  return (
    <div>
      <h1 className="text-4xl font-bold text-teal-900 mb-6">
        User Management API
      </h1>

      <div className="prose max-w-none text-gray-700">
        <p className="mb-6">
          The User Management API allows you to handle user registration and
          authentication in your ticketing system. This API provides secure
          endpoints for user registration and login functionality.
        </p>

        <CopyableBaseUrl url={baseUrl} />

        <h2 className="text-2xl font-bold text-teal-900 mb-4">
          Authentication Endpoints
        </h2>

        <div className="space-y-8">
          {/* Register Endpoint */}
          <div className="border-l-4 border-teal-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-teal-900">
                Register User
              </h3>
              <CopyableEndpoint
                method="POST"
                endpoint="/register"
                baseUrl={baseUrl}
              />
            </div>
            <p className="text-gray-600 mb-2">
              Creates a new user account in the ticketing system.
            </p>
            <p className="font-mono text-sm mb-4 text-gray-500">
              POST {baseUrl}/register
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">Request Body</h4>
              <CopyableCodeBlock
                code={`{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}`}
              />
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">
                Success Response (201 Created)
              </h4>
              <CopyableCodeBlock
                code={`{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "usr_123456789",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
              />
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">
                Error Response (400 Bad Request)
              </h4>
              <CopyableCodeBlock
                code={`{
  "success": false,
  "message": "Email already exists",
  "errors": {
    "email": "This email is already registered"
  }
}`}
              />
            </div>
          </div>

          {/* Login Endpoint */}
          <div className="border-l-4 border-teal-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-teal-900">
                Login User
              </h3>
              <CopyableEndpoint
                method="POST"
                endpoint="/login"
                baseUrl={baseUrl}
              />
            </div>
            <p className="text-gray-600 mb-2">
              Authenticates a user and returns an access token.
            </p>
            <p className="font-mono text-sm mb-4 text-gray-500">
              POST {baseUrl}/login
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">Request Body</h4>
              <CopyableCodeBlock
                code={`{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}`}
              />
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">
                Success Response (200 OK)
              </h4>
              <CopyableCodeBlock
                code={`{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "usr_123456789",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "lastLoginAt": "2024-01-15T14:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
              />
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2">
                Error Response (401 Unauthorized)
              </h4>
              <CopyableCodeBlock
                code={`{
  "success": false,
  "message": "Invalid credentials",
  "errors": {
    "auth": "Email or password is incorrect"
  }
}`}
              />
            </div>
          </div>

          {/* Authentication Headers */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Authentication Headers
            </h3>
            <p className="text-gray-600 mb-4">
              For protected endpoints, include the JWT token in the
              Authorization header:
            </p>
            <CopyableCodeBlock
              code={`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
             
            />
          </div>

          {/* Field Validation */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="text-xl font-semibold text-orange-900 mb-2">
              Field Validation
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-orange-900">Name</h4>
                <p className="text-sm text-gray-600">
                  Required, minimum 2 characters, maximum 100 characters
                </p>
              </div>
              <div>
                <h4 className="font-medium text-orange-900">Email</h4>
                <p className="text-sm text-gray-600">
                  Required, must be a valid email format, maximum 255 characters
                </p>
              </div>
              <div>
                <h4 className="font-medium text-orange-900">Password</h4>
                <p className="text-sm text-gray-600">
                  Required, minimum 8 characters, must contain at least one
                  uppercase letter, one lowercase letter, and one number
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for copyable base URL
function CopyableBaseUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border mb-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-teal-900 mb-2">Base URL</h3>
          <p className="text-gray-600 font-mono text-lg">{url}</p>
        </div>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="sm"
          className="ml-4 flex items-center gap-2 hover:bg-teal-50 hover:border-teal-300"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Component for copyable endpoints
function CopyableEndpoint({
  method,
  endpoint,
  baseUrl,
}: {
  method: string;
  endpoint: string;
  baseUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `${baseUrl}${endpoint}`;

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-200";
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PUT":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Button
      onClick={copyEndpoint}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 hover:bg-gray-50"
    >
      <span
        className={`px-2 py-1 rounded text-xs font-semibold border ${getMethodColor(
          method
        )}`}
      >
        {method.toUpperCase()}
      </span>
      {copied ? (
        <>
          <Check className="h-3 w-3 text-green-600" />
          <span className="text-xs text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span className="text-xs">Copy URL</span>
        </>
      )}
    </Button>
  );
}

// Component for copyable code blocks
function CopyableCodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="relative">
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
        <Button
          onClick={copyCode}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400 ml-1">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="text-xs ml-1">Copy</span>
            </>
          )}
        </Button>
        <pre className="pr-16">{code}</pre>
      </div>
    </div>
  );
}

