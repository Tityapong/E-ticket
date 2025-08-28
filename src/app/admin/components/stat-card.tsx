import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  className?: string
}

export function StatCard({ icon: Icon, value, label, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-pink-50 p-3">
            <Icon className="h-6 w-6 text-[#2B3674]" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-[#2B3674]">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}