import Link from "next/link"
import { ArrowRight } from "lucide-react"

const sections = [
  {
    title: "API Integration",
    links: [
      { href: "/services/general", label: "General" },
      { href: "/services/create-transaction", label: "Create Transaction" },
      { href: "/services/check-transaction", label: "Check Transaction API" },
      { href: "/push-back-notification", label: "Push Back Notification" },
      { href: "/refund-transaction", label: "Refund Transaction" },
      { href: "/transaction-list", label: "Transaction List API" },
      { href: "/pre-authorization", label: "Pre-Authorization" },
      { href: "/account-on-file", label: "Account-On-File (AOF)" },
      { href: "/card-on-file", label: "Card-On-File (COF)" },
      { href: "/exchange-rate", label: "Exchange rate" },
      { href: "/payment-link", label: "Payment Link" },
    ],
  },
  {
    title: "PayWay Plugins",
    links: [
      { href: "/woocommerce", label: "WooCommerce" },
      { href: "/prestashop", label: "PrestaShop" },
    ],
  },
  {
    title: "Design Guidelines",
    links: [
      { href: "/merchant-integration", label: "Merchant integration guideline" },
      { href: "/credential-files", label: "Credential on files" },
      { href: "/qr-invoice", label: "QR on Invoice" },
    ],
  },
  {
    title: "Other",
    links: [
      { href: "/register", label: "Register" },
      { href: "/test-card-number", label: "Test Card Number" },
    ],
  },
]

export default function DocumentationNav() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h2 className="text-xl font-semibold text-teal-900">{section.title}</h2>
            <div className="space-y-3">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 text-teal-600 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
