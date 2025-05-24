"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Home, X, Folder, ShoppingCartIcon, TicketIcon, CreditCardIcon, TagIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: Home
  },
  {
    name: "CRUD Event",
    href: "/admin/dashboard/crud-event",
    icon: LayoutDashboard
  },
  {
    name: "Order",
    href: "/admin/dashboard/order",
    icon: ShoppingCartIcon
  },
  {
    name: "Payment",
    href: "/admin/dashboard/payment",
    icon: CreditCardIcon
  },
  {
    name: "Add Category",
    href: "/admin/dashboard/add-category",
    icon: Folder 
  },
  {
    name: "Ticket-Type",
    href: "/admin/dashboard/ticket-type",
    icon: TicketIcon
  },
  {
    name: "Discount",
    href: "/admin/dashboard/discount",
    icon: TagIcon
  },
  {
    name: "Customer",
    href: "/admin/dashboard/customer",
    icon: Users
  }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const isActiveRoute = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block border-r border-gray-200",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Close button - Mobile only */}
          <div className="lg:hidden absolute right-2 top-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          {/* Sidebar Header */}
          <div className="text-2xl font-bold ml-4 mt-4">
            <span className="text-slate-700">Tix</span>
            <span className="text-teal-500">Central</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = isActiveRoute(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose()
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors",
                      isActive
                        ? "bg-pink-50 text-[#2B3674] font-medium"
                        : "text-gray-500 hover:bg-pink-50/80 hover:text-[#2B3674]"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}
