import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Toaster />
      {/* Layout UI */}
      <main>{children}</main>
    </>
  )
}
