"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const sidebarItems = [
  { href: "/general", label: "General" },
  { href: "/create-transaction", label: "Create Transaction" },
  { href: "/check-transaction", label: "Check Transaction API" },
  { href: "/push-back-notification", label: "Push Back Notification" },
  { href: "/refund-transaction", label: "Refund Transaction" },
  { href: "/transaction-list", label: "Transaction List API" },
  { href: "/pre-authorization", label: "Pre-Authorization" },
  { href: "/account-on-file", label: "Account-On-File (AOF)" },
  { href: "/card-on-file", label: "Card-On-File (COF)" },
  { href: "/exchange-rate", label: "Exchange Rate" },
  { href: "/payment-link", label: "Payment Link" },
  { href: "/merchant-portal", label: "Merchant Portal" },
]

export function DocumentationSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 min-h-screen border-r bg-gray-50">
      <Collapsible defaultOpen className="p-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left rounded-md hover:bg-gray-100 group">
          <span className="text-lg font-semibold text-blue-600">API Integration</span>
          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-2 py-1.5 text-sm rounded-md transition-colors ${
                pathname === item.href ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

