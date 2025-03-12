"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

// Navigation items for the API Integration section
const apiIntegrationItems = [
  { href: "/services/general", label: "General" },
  { href: "/services/create-transaction", label: "Create Transaction" },
  { href: "/services/check-transaction", label: "Check Transaction API" },
  { href: "/push-back-notification", label: "Push Back Notification" },
  { href: "/refund-transaction", label: "Refund Transaction" },
  { href: "/transaction-list-api", label: "Transaction List API" },
  { href: "/pre-authorization", label: "Pre-Authorization" },
  { href: "/account-on-file", label: "Account-On-File (AOF)" },
  { href: "/card-on-file", label: "Card-On-File (COF)" },
  { href: "/exchange-rate", label: "Exchange Rate" },
  { href: "/payment-link", label: "Payment Link" },
  { href: "/merchant-portal", label: "Merchant Portal" },
]

export function ApiSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="w-64 min-h-screen border-r ">
      <div className="p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-2 text-left rounded-md bg-gray-100 hover:bg-gray-200 group"
        >
          <span className="text-base font-medium text-teal-500">API Integration</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
        

        {isOpen && (
          <div className="mt-2 space-y-0.5">
            {apiIntegrationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-2 py-2 text-sm rounded-md transition-colors ${
                  pathname === item.href ? "text-teal-500 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      
    </div>
    
  )
}

