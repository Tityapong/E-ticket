


import type { ReactNode } from "react"
import ApiSidebar from "@/components/api-sidebar"

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-7xl mx-auto min-h-screen bg-gray-50">
      <ApiSidebar />
      <main className="flex-1 p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}

