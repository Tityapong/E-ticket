"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EventManagementPage() {
  const baseUrl = "https://etickets.ticket.publicvm.com/api/events"

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-900 mb-6">Event Management API</h1>

      <div className="prose prose-sm sm:prose max-w-none text-gray-700">
        <p className="mb-6 text-sm sm:text-base leading-relaxed">
          The Event Management API allows you to create and manage events in your ticketing system, including event
          details, scheduling, venue information, and categorization.
        </p>

        <CopyableBaseUrl url={baseUrl} />

        <h2 className="text-xl sm:text-2xl font-bold text-teal-900 mb-4 mt-8">Event Endpoints</h2>

        <div className="space-y-8">
          {/* Create Event */}
          <div className="border-l-4 border-teal-500 pl-3 sm:pl-4">
            <div className="flex flex-col gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-teal-900">Create Event</h3>
              <div className="self-start">
                <CopyableEndpoint method="POST" endpoint="" baseUrl={baseUrl} />
              </div>
            </div>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Creates a new event in the ticketing system.</p>
            <p className="font-mono text-xs sm:text-sm mb-4 text-gray-500 break-all bg-gray-100 p-2 rounded">
              POST {baseUrl}
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Request Body</h4>
              <CopyableCodeBlock
                code={`{
  "event_name": "Summer Music Festival 2024",
  "image": "https://example.com/images/summer-festival.jpg",
  "event_description": "Join us for an unforgettable three-day music festival featuring top artists from around the world. Experience amazing performances, delicious food, and great company in a beautiful outdoor setting.",
  "event_date": "2024-07-15",
  "start_time": "10:00:00",
  "end_time": "22:00:00",
  "event_location": "Central Park Amphitheater, New York, NY",
  "category_id": 1
}`}
              />
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Success Response (201 Created)</h4>
              <CopyableCodeBlock
                code={`{
    "event_name": "CONCERT tena",
    "image": "http://127.0.0.1:8000/storage/events/RGykcwpS7VzS90iuLw99XgKBjw5lxvaWfdY6DXwd.png",
    "event_description": "A two-day conference covering AI, cloud, and startup culture in Southeast Asia.",
    "event_date": "2025-07-18",
    "start_time": "09:00",
    "end_time": "17:30",
    "event_location": "Phnom Penh Convention Center",
    "user_id": 2,
    "category_id": "1",
    "updated_at": "2025-06-08T14:40:02.000000Z",
    "created_at": "2025-06-08T14:40:02.000000Z",
    "id": 7
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
    "event_name": "Event name is required",
    "event_date": "Event date must be a future date",
    "category_id": "Invalid category ID"
  }
}`}
              />
            </div>
          </div>

          {/* Get Events */}
          <div className="border-l-4 border-teal-500 pl-3 sm:pl-4">
            <div className="flex flex-col gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-teal-900">Get Events</h3>
              <div className="self-start">
                <CopyableEndpoint method="GET" endpoint="" baseUrl={baseUrl} />
              </div>
            </div>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">
              Retrieves a list of events with optional filtering and pagination.
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
                        <td className="py-2 px-3 sm:px-4 font-mono text-xs sm:text-sm whitespace-nowrap">
                          category_id
                        </td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap">integer</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">Filter by event category ID</td>
                      </tr>
                      <tr className="border-t bg-gray-50">
                        <td className="py-2 px-3 sm:px-4 font-mono text-xs sm:text-sm whitespace-nowrap">event_date</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap">string (YYYY-MM-DD)</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">Filter events by specific date</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-2 px-3 sm:px-4 font-mono text-xs sm:text-sm whitespace-nowrap">location</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap">string</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                          Filter by event location (partial match)
                        </td>
                      </tr>
                      <tr className="border-t bg-gray-50">
                        <td className="py-2 px-3 sm:px-4 font-mono text-xs sm:text-sm whitespace-nowrap">status</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap">string</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                          Filter by status (active, inactive, cancelled)
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-2 px-3 sm:px-4 font-mono text-xs sm:text-sm whitespace-nowrap">limit</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap">integer</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                          Number of events to return (default: 20, max: 100)
                        </td>
                      </tr>
                      <tr className="border-t bg-gray-50">
                        <td className="py-2 px-3 sm:px-4 font-mono text-xs sm:text-sm whitespace-nowrap">offset</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap">integer</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                          Number of events to skip (for pagination)
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
      "id": "evt_123456789",
      "event_name": "Summer Music Festival 2024",
      "image": "https://example.com/images/summer-festival.jpg",
      "event_description": "Join us for an unforgettable three-day music festival...",
      "event_date": "2024-07-15",
      "start_time": "10:00:00",
      "end_time": "22:00:00",
      "event_location": "Central Park Amphitheater, New York, NY",
      "category_id": 1,
      "category_name": "Music",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "evt_123456790",
      "event_name": "Tech Conference 2024",
      "image": "https://example.com/images/tech-conference.jpg",
      "event_description": "Annual technology conference featuring industry leaders...",
      "event_date": "2024-08-20",
      "start_time": "09:00:00",
      "end_time": "18:00:00",
      "event_location": "Convention Center, San Francisco, CA",
      "category_id": 2,
      "category_name": "Technology",
      "status": "active",
      "created_at": "2024-01-16T14:20:00Z"
    }
  ],

}`}
              />
            </div>
          </div>

          {/* Get Single Event */}
          <div className="border-l-4 border-teal-500 pl-3 sm:pl-4">
            <div className="flex flex-col gap-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-teal-900">Get Single Event</h3>
              <div className="self-start">
                <CopyableEndpoint method="GET" endpoint="/{id}" baseUrl={baseUrl} />
              </div>
            </div>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Retrieves a specific event by its ID.</p>
            <p className="font-mono text-xs sm:text-sm mb-4 text-gray-500 break-all bg-gray-100 p-2 rounded">
              GET {baseUrl}/{"{{eventId}}"}
            </p>

            <div className="mt-4">
              <h4 className="font-medium text-teal-900 mb-2 text-sm sm:text-base">Success Response (200 OK)</h4>
              <CopyableCodeBlock
                code={`{
  "success": true,
  "data": {
    "id": "evt_123456789",
    "event_name": "Summer Music Festival 2024",
    "image": "https://example.com/images/summer-festival.jpg",
    "event_description": "Join us for an unforgettable three-day music festival featuring top artists from around the world. Experience amazing performances, delicious food, and great company in a beautiful outdoor setting.",
    "event_date": "2024-07-15",
    "start_time": "10:00:00",
    "end_time": "22:00:00",
    "event_location": "Central Park Amphitheater, New York, NY",
    "category_id": 1,
    "category_name": "Music",
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
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

          {/* Field Validation */}
          <div className="border-l-4 border-orange-500 pl-3 sm:pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-orange-900 mb-4">Field Validation</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">event_name</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Required, minimum 3 characters, maximum 255 characters
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">image</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Optional, must be a valid URL if provided</p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">event_description</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Required, minimum 10 characters, maximum 2000 characters
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">event_date</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Required, must be in YYYY-MM-DD format and a future date
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">start_time</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Required, must be in HH:MM:SS format (24-hour)</p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">end_time</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Required, must be in HH:MM:SS format and after start_time
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">event_location</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Required, minimum 5 characters, maximum 500 characters
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900 text-sm sm:text-base">category_id</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Required, must be a valid existing category ID</p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Categories */}
          <div className="border-l-4 border-purple-500 pl-3 sm:pl-4">
            <h3 className="text-lg sm:text-xl font-semibold text-purple-900 mb-2">Event Categories</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Common category IDs you can use when creating events:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base">1 - Music</p>
                <p className="text-xs sm:text-sm text-gray-600">Concerts, festivals, performances</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base">2 - Technology</p>
                <p className="text-xs sm:text-sm text-gray-600">Conferences, workshops, seminars</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base">3 - Sports</p>
                <p className="text-xs sm:text-sm text-gray-600">Games, tournaments, competitions</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base">4 - Arts & Culture</p>
                <p className="text-xs sm:text-sm text-gray-600">Exhibitions, theater, cultural events</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base">5 - Business</p>
                <p className="text-xs sm:text-sm text-gray-600">Networking, corporate events</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm sm:text-base">6 - Education</p>
                <p className="text-xs sm:text-sm text-gray-600">Workshops, training, courses</p>
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

