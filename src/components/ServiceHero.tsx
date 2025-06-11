"use client"
import { Search } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { Input } from "@/components/ui/input"

export default function ServicesHero() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-700 tracking-tight">
            E-Ticket Provider
          </h1>
          <p className="text-xl text-gray-600 max-w-xl">
            Here you&apos;ll find detailed documentation and references to help you integrate PayWay APIs on your
            software solution to take online payments securely on any platform.
          </p>
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search API, Payment and more"
              className="pl-10 h-12 text-base bg-white border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative flex justify-center lg:justify-end">
        <DotLottieReact src="/service.lottie" loop autoplay />
        </div>
      </div>
    </div>
  )
}

