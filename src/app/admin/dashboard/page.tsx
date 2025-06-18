'use client';
import React, { useState, useEffect, useCallback } from "react";
import { ClipboardList, Users, LayoutDashboard } from "lucide-react";
import { StatCard } from "../components/stat-card";
import { ServiceCard } from "../components/service-card";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth";

// Define the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Service {
  image: string;
  title: string;
  bookings: number;
}

// Define the structure of the API response for users
interface UsersApiResponse {
  users: Array<{ id: number; name: string; email: string; }>;
  count: number;
  status: string;
}

// Define the structure of the API response for order items (from /api/orders)
// This matches the OrderDetail type we used in OrderManager
interface OrderItemApiResponse {
  order_id: number;
  order_date: string;
  order_status: string;
  paymentStatus: string;
  quantity: number;
  unitPrice: string; // Keep as string as per API response, parse when using
  total: string;    // Keep as string as per API response, parse when using
  ticketType: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventImage: string;
  qr_code: string | null;
  is_scanned: boolean;
  order_image: string | null;
}


export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState<string>("0");
  const [totalBookingTickets, setTotalBookingTickets] = useState<string>("0"); // New state for booking tickets
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [isLoadingBookingTickets, setIsLoadingBookingTickets] = useState<boolean>(true); // New loading state
  const [token, setToken] = useState<string | null>(null);

  // Hardcoded `servicesData` for "Total Events" (assuming this is local for now)
  const servicesData: Service[] = [
    {
      image: "/assets/lucky.png",
      title: "Concert",
      bookings: 50,
    },
  ];

  const totalEventsCount = servicesData.length;

  // We will derive dashboardStats directly in the render or in a separate useEffect
  // that depends on totalUsers, totalBookingTickets, isLoadingUsers, isLoadingBookingTickets


  // --- Auth Token Fetch ---
  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await getAuthToken();
      setToken(savedToken);
      if (!savedToken) {
        toast.error("Authentication token not found. Please log in.");
        setIsLoadingUsers(false);
        setIsLoadingBookingTickets(false); // Stop all loading if no token
      }
    };
    fetchToken();
  }, []);

  // --- Fetch Total Users ---
  const fetchTotalUsers = useCallback(async () => {
    if (!token || !API_URL) {
      setIsLoadingUsers(false);
      if (!API_URL) toast.error("API_URL is not defined for users.");
      return;
    }

    setIsLoadingUsers(true);
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error("Session expired or unauthorized. Please log in again.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Failed to fetch user count: ${response.status}`);
      }

      const data: UsersApiResponse = await response.json();

      if (typeof data.count === 'number') {
        setTotalUsers(data.count.toString());
        // toast.success("User count fetched successfully!"); // Consider if this toast is too frequent
      } else {
        toast.error("Invalid user count format in API response.");
        setTotalUsers("N/A");
        console.error("API response for users did not contain a valid 'count':", data);
      }
    } catch (error: any) {
      console.error("Error fetching total users:", error);
      toast.error(error.message || "An unexpected error occurred while fetching user count.");
      setTotalUsers("Error");
    } finally {
      setIsLoadingUsers(false);
    }
  }, [token]);

  // --- Fetch Total Booking Tickets (Order Items) ---
  const fetchTotalBookingTickets = useCallback(async () => {
    if (!token || !API_URL) {
      setIsLoadingBookingTickets(false);
      if (!API_URL) toast.error("API_URL is not defined for booking tickets.");
      return;
    }

    setIsLoadingBookingTickets(true);
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error("Session expired or unauthorized. Please log in again.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Failed to fetch booking tickets count: ${response.status}`);
      }

      const data: OrderItemApiResponse[] = await response.json();

      if (Array.isArray(data)) {
        setTotalBookingTickets(data.length.toString());
        // toast.success("Booking tickets count fetched successfully!"); // Consider if this toast is too frequent
      } else {
        toast.error("Invalid booking tickets response format. Expected an array.");
        setTotalBookingTickets("N/A");
        console.error("API response for orders was not an array:", data);
      }
    } catch (error: any) {
      console.error("Error fetching total booking tickets:", error);
      toast.error(error.message || "An unexpected error occurred while fetching booking tickets.");
      setTotalBookingTickets("Error");
    } finally {
      setIsLoadingBookingTickets(false);
    }
  }, [token]);


  // --- Effect to call fetch functions ---
  useEffect(() => {
    if (token) { // Only fetch if token is available
      fetchTotalUsers();
      fetchTotalBookingTickets();
    } else if (token === null) {
        // If token is explicitly null after trying to fetch it, stop loading
        setIsLoadingUsers(false);
        setIsLoadingBookingTickets(false);
    } else if (!API_URL) {
        // If API_URL is not set, stop all loading and show error
        setIsLoadingUsers(false);
        setIsLoadingBookingTickets(false);
        toast.error("Environment variable NEXT_PUBLIC_API_URL is not set.");
    }
  }, [token, fetchTotalUsers, fetchTotalBookingTickets, API_URL]); // Removed totalUsers, totalBookingTickets, isLoading from dependencies


  // Derive dashboardStats directly from the latest state values
  const dashboardStats = [
    {
      icon: ClipboardList,
      value: isLoadingBookingTickets ? "Loading..." : totalBookingTickets,
      label: "Total Booking Tickets",
    },
    {
      icon: LayoutDashboard,
      value: totalEventsCount.toString(), // Local count
      label: "Total Events",
    },
    {
      icon: Users,
      value: isLoadingUsers ? "Loading..." : totalUsers,
      label: "Total Users",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Section */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Services Section (Top Events) */}
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