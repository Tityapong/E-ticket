"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  const baseUrl = "https://etickets.ticket.publicvm.com/api/orders"

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-900 mb-6">Order Management API</h1>

      <div className="prose prose-sm sm:prose max-w-none text-gray-700">
        <p className="mb-6 text-sm sm:text-base leading-relaxed">
          The Order Management API allows you to create and manage ticket orders, including cart management, order
          status tracking, and payment processing for event tickets.
        </p>

        <CopyableBaseUrl url={baseUrl} />

        <h2 className="text-xl sm:text-2xl font-bold text-teal-900 mb-4 mt-8">Order Endpoints</h2>

        <div className="space-y-8">
          {/* Create Order */}
          <div className="border-l-4 border-teal-500 pl-3 sm:pl-4">
            <div className="flex flex-col gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-teal-900">Create Order</h3>
              <div className="self-start">
                <CopyableEndpoint method="POST" endpoint="" baseUrl={baseUrl} />
              </div>
            </div>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">
              Creates a new order for event tickets with specified quantity and pricing.
            </p>
            <p className="font-mono text-xs sm:text-sm mb-4 text-gray-500 break-all bg-gray-100 p-2 rounded">
              POST {baseUrl}
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Request Body</h4>
              <CopyableCodeBlock
                code={`{
  "user_id": 1,
  "ticket_type_id": 7,
  "order_status": "Cart",
  "quantity": 2,
  "price_at_purchase": 15.00,
  "total_amount": 30.00
}`}
              />
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Success Response (201 Created)</h4>
              <CopyableCodeBlock
                code={`{
  "user_id": 1,
  "ticket_type_id": 7,
  "order_status": "Cart",
  "quantity": 2,
  "price_at_purchase": 15,
  "total_amount": 30,
  "updated_at": "2025-06-11T14:51:23.000000Z",
  "created_at": "2025-06-11T14:51:23.000000Z",
  "id": 13
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
    "user_id": "User ID is required",
    "ticket_type_id": "Ticket type ID is required",
    "quantity": "Quantity must be at least 1",
    "price_at_purchase": "Price must be greater than 0"
  }
}`}
              />
            </div>
          </div>

          {/* Get Orders List */}
          <div className="border-l-4 border-teal-500 pl-3 sm:pl-4">
            <div className="flex flex-col gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-teal-900">Get Orders List</h3>
              <div className="self-start">
                <CopyableEndpoint method="GET" endpoint="" baseUrl={baseUrl} />
              </div>
            </div>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">
              Retrieves a list of orders with detailed event and ticket information.
            </p>
            <p className="font-mono text-xs sm:text-sm mb-4 text-gray-500 break-all bg-gray-100 p-2 rounded">
              GET {baseUrl}
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-3 text-sm sm:text-base">Query Parameters</h4>
              <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-3 sm:px-4 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                          Parameter
                        </th>
                        <th className="py-3 px-3 sm:px-4 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                          Type
                        </th>
                        <th className="py-3 px-3 sm:px-4 text-left font-medium text-xs sm:text-sm">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-2 px-3 sm:px-4 font-mono text-xs sm:text-sm whitespace-nowrap">user_id</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap">integer</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">Filter orders by user ID</td>
                      </tr>
                      <tr className="border-t bg-gray-50">
                        <td className="py-2 px-3 sm:px-4 font-mono text-xs sm:text-sm whitespace-nowrap">
                          order_status
                        </td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap">string</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                          Filter by status (Cart, Confirmed, Cancelled)
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-2 px-3 sm:px-4 font-mono text-xs sm:text-sm whitespace-nowrap">
                          payment_status
                        </td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap">string</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                          Filter by payment status (Pending, Paid, Failed)
                        </td>
                      </tr>
                      <tr className="border-t bg-gray-50">
                        <td className="py-2 px-3 sm:px-4 font-mono text-xs sm:text-sm whitespace-nowrap">limit</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap">integer</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                          Number of orders to return (default: 20, max: 100)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Success Response (200 OK)</h4>
              <CopyableCodeBlock
                code={`{
  "success": true,
  "data": [
    {
      "order_id": 1,
      "order_date": "2025-05-22 10:00:53",
      "order_status": "Cart",
      "paymentStatus": "Pending",
      "quantity": 2,
      "unitPrice": "15.00",
      "total": "30.00",
      "ticketType": "Early-Bird",
      "eventTitle": "CONCERT VANDA",
      "eventDate": "July 18, 2025",
      "eventTime": "09:00:00 - 17:30:00",
      "eventLocation": "Phnom Penh Convention Center",
      "eventImage": "http://127.0.0.1:8000/storage/events/HDk5nD0dyGhUz1v5GCkVjNAdKj2MwKNyUgbkYEOu.png",
      "qr_code": "sample-qr-code",
      "is_scanned": false
    },
    {
      "order_id": 2,
      "order_date": "2025-05-22 11:30:15",
      "order_status": "Confirmed",
      "paymentStatus": "Paid",
      "quantity": 1,
      "unitPrice": "25.00",
      "total": "25.00",
      "ticketType": "VIP",
      "eventTitle": "Tech Conference 2025",
      "eventDate": "August 10, 2025",
      "eventTime": "08:00:00 - 18:00:00",
      "eventLocation": "Diamond Island Convention Center",
      "eventImage": "http://127.0.0.1:8000/storage/events/tech-conference.png",
      "qr_code": "tech-conf-qr-001",
      "is_scanned": false
    }
  ],

}`}
              />
            </div>
          </div>

          {/* Get Single Order */}
          <div className="border-l-4 border-teal-500 pl-3 sm:pl-4">
            <div className="flex flex-col gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-teal-900">Get Single Order</h3>
              <div className="self-start">
                <CopyableEndpoint method="GET" endpoint="/{orderId}" baseUrl={baseUrl} />
              </div>
            </div>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Retrieves a specific order by its ID.</p>
            <p className="font-mono text-xs sm:text-sm mb-4 text-gray-500 break-all bg-gray-100 p-2 rounded">
              GET {baseUrl}/{"{{orderId}}"}
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Success Response (200 OK)</h4>
              <CopyableCodeBlock
                code={`{
  "success": true,
  "data": {
    "order_id": 1,
    "order_date": "2025-05-22 10:00:53",
    "order_status": "Cart",
    "paymentStatus": "Pending",
    "quantity": 2,
    "unitPrice": "15.00",
    "total": "30.00",
    "ticketType": "Early-Bird",
    "eventTitle": "CONCERT VANDA",
    "eventDate": "July 18, 2025",
    "eventTime": "09:00:00 - 17:30:00",
    "eventLocation": "Phnom Penh Convention Center",
    "eventImage": "http://127.0.0.1:8000/storage/events/HDk5nD0dyGhUz1v5GCkVjNAdKj2MwKNyUgbkYEOu.png",
    "qr_code": "sample-qr-code",
    "is_scanned": false
  }
}`}
              />
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Error Response (404 Not Found)</h4>
              <CopyableCodeBlock
                code={`{
  "success": false,
  "message": "Order not found",
  "error": "No order found with the provided ID"
}`}
              />
            </div>
          </div>

          {/* Update Order Status */}
          <div className="border-l-4 border-teal-500 pl-3 sm:pl-4">
            <div className="flex flex-col gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-teal-900">Update Order Status</h3>
              <div className="self-start">
                <CopyableEndpoint method="PUT" endpoint="/{orderId}/status" baseUrl={baseUrl} />
              </div>
            </div>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Updates the status of an existing order.</p>
            <p className="font-mono text-xs sm:text-sm mb-4 text-gray-500 break-all bg-gray-100 p-2 rounded">
              PUT {baseUrl}/{"{{orderId}}"}/status
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Request Body</h4>
              <CopyableCodeBlock
                code={`{
  "order_status": "Confirmed",
  "payment_status": "Paid"
}`}
              />
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Success Response (200 OK)</h4>
              <CopyableCodeBlock
                code={`{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order_id": 1,
    "order_status": "Confirmed",
    "payment_status": "Paid",
    "updated_at": "2025-06-11T15:30:45.000000Z"
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
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">user_id</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Required, must be a valid existing user ID</p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">ticket_type_id</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Required, must be a valid existing ticket type ID</p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">order_status</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Required, must be one of: Cart, Confirmed, Cancelled
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">quantity</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Required, must be a positive integer (minimum 1)</p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">price_at_purchase</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Required, must be a positive decimal number (e.g., 15.00)
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">total_amount</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Required, should equal quantity × price_at_purchase
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="border-l-4 border-blue-500 pl-3 sm:pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">Order Status Values</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">Available order status values:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base text-yellow-700">Cart</p>
                <p className="text-xs sm:text-sm text-gray-600">Items added to cart, not yet confirmed</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base text-green-700">Confirmed</p>
                <p className="text-xs sm:text-sm text-gray-600">Order confirmed and processed</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base text-red-700">Cancelled</p>
                <p className="text-xs sm:text-sm text-gray-600">Order has been cancelled</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="border-l-4 border-purple-500 pl-3 sm:pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-purple-900 mb-2">Payment Status Values</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">Available payment status values:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base text-yellow-700">Pending</p>
                <p className="text-xs sm:text-sm text-gray-600">Payment is awaiting processing</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base text-green-700">Paid</p>
                <p className="text-xs sm:text-sm text-gray-600">Payment completed successfully</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base text-red-700">Failed</p>
                <p className="text-xs sm:text-sm text-gray-600">Payment processing failed</p>
              </div>
            </div>
          </div>

          {/* QR Code Information */}
          <div className="border-l-4 border-indigo-500 pl-3 sm:pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-900 mb-2">QR Code & Scanning</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Each confirmed order includes QR code functionality for ticket validation:
            </p>
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">QR Code Generation</h4>
                <p className="text-sm text-indigo-800">
                  QR codes are automatically generated when an order is confirmed and can be used for event entry
                  validation.
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">Scanning Status</h4>
                <p className="text-sm text-indigo-800">
                  The <code className="bg-indigo-100 px-2 py-1 rounded">is_scanned</code> field tracks whether the
                  ticket has been used for entry (false = unused, true = used).
                </p>
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
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div className="relative">
      <div className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm overflow-x-auto">
        <Button
          onClick={copyCode}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 z-10"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400 ml-1 hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="text-xs ml-1 hidden sm:inline">Copy</span>
            </>
          )}
        </Button>
        <pre className="pr-12 sm:pr-16 whitespace-pre-wrap break-words">{code}</pre>
      </div>
    </div>
  )
}

