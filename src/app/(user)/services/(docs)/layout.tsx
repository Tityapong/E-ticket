import type { ReactNode } from "react"
import ApiSidebar from "@/components/api-sidebar"

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <ApiSidebar />
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 py-6 lg:px-8">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
