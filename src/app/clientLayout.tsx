"use client"

import type React from "react"
import { useEffect } from "react"
import { Toaster } from "sonner"
import { initAuth } from "@/lib/auth"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useEffect(() => {
    initAuth()
  }, [])

  return (
    <>
      {children}
      <Toaster position="top-right" theme="light" richColors />
    </>
  )
}
