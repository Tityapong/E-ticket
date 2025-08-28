import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface ServiceCardProps {
  image: string
  title: string
  bookings: number
}

export function ServiceCard({ image, title, bookings }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-32 w-32">
            <Image
              src={image}
              alt={title}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[#2B3674]">{title}</h3>
            <p className="text-sm text-gray-500">{bookings} bookings</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}