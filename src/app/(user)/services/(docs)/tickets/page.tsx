"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TicketsPage() {
  const baseUrl = "https://etickets.ticket.publicvm.com/api/tickets"

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-900 mb-6">Tickets API</h1>

      <div className="prose prose-sm sm:prose max-w-none text-gray-700">
        <p className="mb-6 text-sm sm:text-base leading-relaxed">
          The Tickets API allows you to create and manage ticket types for events, control ticket availability, pricing,
          and track ticket sales with discount management.
        </p>

        <CopyableBaseUrl url={baseUrl} />

        <h2 className="text-xl sm:text-2xl font-bold text-teal-900 mb-4 mt-8">Ticket Endpoints</h2>

        <div className="space-y-8">
          {/* Create Tickets */}
          <div className="border-l-4 border-teal-500 pl-3 sm:pl-4">
            <div className="flex flex-col gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-teal-900">Create Tickets</h3>
              <div className="self-start">
                <CopyableEndpoint method="POST" endpoint="" baseUrl={baseUrl} />
              </div>
            </div>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">
              Creates multiple ticket types for an event with pricing and availability.
            </p>
            <p className="font-mono text-xs sm:text-sm mb-4 text-gray-500 break-all bg-gray-100 p-2 rounded">
              POST {baseUrl}
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Request Body</h4>
              <CopyableCodeBlock
                code={`{
  "tickets": [
    {
      "event_id": 2,
      "ticket_name": "Early-Bird",
      "price": 20.00,
      "quantity_available": 50,
      "discount": 10
    },
    {
      "event_id": 2,
      "ticket_name": "Regular",
      "price": 30.00,
      "quantity_available": 100,
      "discount": 3
    },
    {
      "event_id": 2,
      "ticket_name": "VIP",
      "price": 80.00,
      "quantity_available": 20,
      "discount": 5
    }
  ]
}`}
              />
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Success Response (201 Created)</h4>
              <CopyableCodeBlock
                code={`{
  "success": true,
  "message": "Tickets created successfully",
  "data": {
    "created_tickets": [
      {
        "id": "tkt_123456789",
        "event_id": 2,
        "ticket_name": "Early-Bird",
        "price": 20.00,
        "quantity_available": 50,
        "discount": 10,
        "final_price": 10.00,
        "status": "active",
        "created_at": "2024-01-15T10:30:00Z"
      },
      {
        "id": "tkt_123456790",
        "event_id": 2,
        "ticket_name": "Regular",
        "price": 30.00,
        "quantity_available": 100,
        "discount": 3,
        "final_price": 27.00,
        "status": "active",
        "created_at": "2024-01-15T10:30:00Z"
      },
      {
        "id": "tkt_123456791",
        "event_id": 2,
        "ticket_name": "VIP",
        "price": 80.00,
        "quantity_available": 20,
        "discount": 5,
        "final_price": 75.00,
        "status": "active",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total_created": 3
  }
}`}
              />
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Error Response (400 Bad Request)</h4>
              <CopyableCodeBlock
                code={`{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "tickets[0].event_id": "Event ID is required",
    "tickets[1].price": "Price must be greater than 0",
    "tickets[2].quantity_available": "Quantity must be at least 1"
  }
}`}
              />
            </div>
          </div>

          {/* Get Tickets by Event */}
          <div className="border-l-4 border-teal-500 pl-3 sm:pl-4">
            <div className="flex flex-col gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-teal-900">Get Tickets by Event</h3>
              <div className="self-start">
                <CopyableEndpoint method="GET" endpoint="/event/{eventId}" baseUrl={baseUrl} />
              </div>
            </div>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Retrieves all ticket types for a specific event.</p>
            <p className="font-mono text-xs sm:text-sm mb-4 text-gray-500 break-all bg-gray-100 p-2 rounded">
              GET {baseUrl}/event/{"{{eventId}}"}
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Success Response (200 OK)</h4>
              <CopyableCodeBlock
                code={`{
  "success": true,
  "data": [
    {
      "id": "tkt_123456789",
      "event_id": 2,
      "ticket_name": "Early-Bird",
      "price": 20.00,
      "quantity_available": 45,
      "discount": 10,
      "final_price": 10.00,
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "tkt_123456790",
      "event_id": 2,
      "ticket_name": "Regular",
      "price": 30.00,
      "quantity_available": 85,
      "discount": 3,
      "final_price": 27.00,
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "tkt_123456791",
      "event_id": 2,
      "ticket_name": "VIP",
      "price": 80.00,
      "quantity_available": 18,
      "discount": 5,
      "final_price": 75.00,
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total_tickets": 3
}`}
              />
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Error Response (404 Not Found)</h4>
              <CopyableCodeBlock
                code={`{
  "success": false,
  "message": "Event not found",
  "error": "No event found with the provided ID"
}`}
              />
            </div>
          </div>

          {/* Get Single Ticket */}
          <div className="border-l-4 border-teal-500 pl-3 sm:pl-4">
            <div className="flex flex-col gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-teal-900">Get Single Ticket</h3>
              <div className="self-start">
                <CopyableEndpoint method="GET" endpoint="/{ticketId}" baseUrl={baseUrl} />
              </div>
            </div>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Retrieves a specific ticket by its ID.</p>
            <p className="font-mono text-xs sm:text-sm mb-4 text-gray-500 break-all bg-gray-100 p-2 rounded">
              GET {baseUrl}/{"{{ticketId}}"}
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Success Response (200 OK)</h4>
              <CopyableCodeBlock
                code={`{
  "success": true,
  "data": {
    "id": "tkt_123456789",
    "event_id": 2,
    "ticket_name": "Early-Bird",
    "price": 20.00,
    "quantity_available": 45,
    "discount": 10,
    "final_price": 10.00,
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}`}
              />
            </div>
          </div>

          {/* Update Ticket */}
          <div className="border-l-4 border-teal-500 pl-3 sm:pl-4">
            <div className="flex flex-col gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-teal-900">Update Ticket</h3>
              <div className="self-start">
                <CopyableEndpoint method="PUT" endpoint="/{ticketId}" baseUrl={baseUrl} />
              </div>
            </div>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Updates an existing ticket information.</p>
            <p className="font-mono text-xs sm:text-sm mb-4 text-gray-500 break-all bg-gray-100 p-2 rounded">
              PUT {baseUrl}/{"{{ticketId}}"}
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Request Body</h4>
              <CopyableCodeBlock
                code={`{
  "ticket_name": "Early-Bird Special",
  "price": 25.00,
  "quantity_available": 60,
  "discount": 15
}`}
              />
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Success Response (200 OK)</h4>
              <CopyableCodeBlock
                code={`{
  "success": true,
  "message": "Ticket updated successfully",
  "data": {
    "id": "tkt_123456789",
    "event_id": 2,
    "ticket_name": "Early-Bird Special",
    "price": 25.00,
    "quantity_available": 60,
    "discount": 15,
    "final_price": 10.00,
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T14:20:00Z"
  }
}`}
              />
            </div>
          </div>

          {/* Field Validation */}
          <div className="border-l-4 border-orange-500 pl-3 sm:pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-orange-900 mb-4">Field Validation</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">event_id</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Required, must be a valid existing event ID</p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">ticket_name</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Required, minimum 2 characters, maximum 100 characters
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">price</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Required, must be a positive decimal number (e.g., 25.99)
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">quantity_available</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Required, must be a positive integer (minimum 1)</p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">discount</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Optional, discount amount in currency (e.g., 5.00 for $5 off)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="border-l-4 border-blue-500 pl-3 sm:pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">Pricing & Discounts</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Understanding how pricing and discounts work in the ticket system:
            </p>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Final Price Calculation</h4>
                <p className="text-sm text-blue-800">
                  <code className="bg-blue-100 px-2 py-1 rounded">final_price = price - discount</code>
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Example: If price is $30.00 and discount is $3.00, final_price will be $27.00
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Discount Types</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • <strong>Fixed Amount:</strong> Discount is a fixed currency amount (e.g., $5.00 off)
                  </li>
                  <li>
                    • <strong>Minimum Value:</strong> Discount cannot exceed the original price
                  </li>
                  <li>
                    • <strong>Optional Field:</strong> If no discount provided, final_price equals price
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ticket Status */}
          <div className="border-l-4 border-purple-500 pl-3 sm:pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-purple-900 mb-2">Ticket Status</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">Available ticket statuses:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base text-green-700">active</p>
                <p className="text-xs sm:text-sm text-gray-600">Ticket is available for purchase</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base text-yellow-700">inactive</p>
                <p className="text-xs sm:text-sm text-gray-600">Ticket is temporarily unavailable</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base text-red-700">sold_out</p>
                <p className="text-xs sm:text-sm text-gray-600">No more tickets available</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base text-gray-700">archived</p>
                <p className="text-xs sm:text-sm text-gray-600">Ticket is no longer available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component for copyable base URL
function CopyableBaseUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border mb-8 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-teal-900 mb-2">Base URL</h3>
          <p className="text-gray-600 font-mono text-sm sm:text-base break-all bg-gray-50 p-2 rounded">{url}</p>
        </div>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-teal-50 hover:border-teal-300 self-start"
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
  )
}

// Component for copyable endpoints
function CopyableEndpoint({
  method,
  endpoint,
  baseUrl,
}: {
  method: string
  endpoint: string
  baseUrl: string
}) {
  const [copied, setCopied] = useState(false)
  const fullUrl = `${baseUrl}${endpoint}`

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-200"
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "PUT":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Button
      onClick={copyEndpoint}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 hover:bg-gray-50 border border-gray-200"
    >
      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getMethodColor(method)}`}>
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
  )
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

