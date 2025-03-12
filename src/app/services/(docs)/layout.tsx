"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import { ApiSidebar } from "@/components/api-sidebar";

// Pages that should show the API sidebar
const apiDocsPaths = [
  "/services/general",
  "/services/create-transaction",
  "/services/check-transaction",
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = apiDocsPaths.includes(pathname);

  return (
    <div className="flex w-7xl mx-auto min-h-screen">
      {showSidebar && <ApiSidebar />}
      <main>{children}</main>
    </div>
  );
}
