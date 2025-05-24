'use client';
import React from "react";
import { ClipboardList, Users, LayoutDashboard } from "lucide-react";
import { StatCard } from "../components/stat-card";
import { ServiceCard } from "../components/service-card";

interface Service {
  image: string;
  title: string;
  bookings: number;
}

export default function DashboardPage() {
  // Hardcoded example stats
  const updatedStats = [
    {
      icon: ClipboardList,
      value: "123",
      label: "Total Booking Tickets",
    },
    {
      icon: LayoutDashboard,
      value: "45",
      label: "Total Events",
    },
    {
      icon: Users,
      value: "789",
      label: "Total Users",
    },
  ];

  // Sample top services
  const servicesData: Service[] = [
    {
      image: "/assets/lucky.png",
      title: "Wedding Service",
      bookings: 25,
    },
    {
      image: "/assets/lucky.png",
      title: "Makeup Artist",
      bookings: 18,
    },
    {
      image: "/assets/lucky.png",
      title: "Catering",
      bookings: 30,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Section */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {updatedStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Services Section */}
        <div className="mt-8">
          <h2 className="mb-6 text-2xl font-semibold text-[#2B3674]">
            Top Event
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {servicesData.map((service, index) => (
              <ServiceCard
                key={index}
                image={service.image}
                title={service.title}
                bookings={service.bookings}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
