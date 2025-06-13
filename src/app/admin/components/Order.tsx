"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth"; // Assuming getAuthToken is correctly implemented

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- Type Definitions ---
type Order = {
  id: number;
  user_id: number;
  order_status: string;
  total_amount: number;
  payment_status: string;
  purchased_at: string | null;
  updated_at: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

type OrderDetail = {
  order_id: number;
  order_date: string;
  order_status: string;
  paymentStatus: string;
  quantity: number;
  unitPrice: number;
  total: number;
  ticketType: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventImage: string;
  qr_code: string | null;
  is_scanned: boolean;
};

// Ensure API_URL is correctly defined and accessible
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  // --- Auth Token Fetch ---
  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await getAuthToken();
      setToken(savedToken);
      // If token is null after fetching, it means user is not logged in or token couldn't be retrieved
      if (!savedToken) {
        toast.error("Authentication token not found. Please log in.");
        setIsLoading(false); // Stop loading if no token
      }
    };
    fetchToken();
  }, []);

  // --- API Calls ---
  const fetchOrders = useCallback(async () => {
    // Check for API_URL presence as well
    if (!token) {
      // Error already toasted by useEffect or previous check
      setIsLoading(false);
      return;
    }
    if (!API_URL) {
      toast.error("API_URL is not defined.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Attempt to parse error message from response body
        let errorMessage = `Failed to fetch orders: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = `Failed to fetch orders: ${errorData.message}`;
          } else if (errorData) {
            errorMessage = `Failed to fetch orders: ${JSON.stringify(errorData)}`;
          }
        } catch (parseError) {
          // If response is not JSON, use the status text
          console.error("Failed to parse error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // IMPORTANT: Ensure 'data' is an array. If the API returns a single object sometimes,
      // you need to handle that.
      if (!Array.isArray(data)) {
        console.error("API response for orders is not an array:", data);
        throw new Error("Invalid API response format for orders.");
      }

      const formattedOrders: Order[] = data.map((order: any) => ({
        id: order.id,
        user_id: order.user_id,
        order_status: order.order_status,
        total_amount: parseFloat(order.total_amount),
        payment_status: order.payment_status,
        purchased_at: order.purchased_at ? new Date(order.purchased_at).toLocaleString() : null,
        created_at: new Date(order.created_at).toLocaleString(),
        updated_at: new Date(order.updated_at).toLocaleString(),
        user: order.user,
      }));

      setOrders(formattedOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error); // Log the full error object
      toast.error(error.message || "An unexpected error occurred while fetching orders.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchOrderDetails = useCallback(async (orderId: number) => {
    if (!token) {
      toast.error("You must be logged in to view order details.");
      return;
    }
    if (!API_URL) {
      toast.error("API_URL is not defined for details.");
      return;
    }

    setIsDetailLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/order-details/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorMessage = `Failed to fetch order details: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = `Failed to fetch order details: ${errorData.message}`;
          } else if (errorData) {
            errorMessage = `Failed to fetch order details: ${JSON.stringify(errorData)}`;
          }
        } catch (parseError) {
          console.error("Failed to parse error response for details:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // IMPORTANT: The provided example API response is a single object, not an array.
      // If the API for `order-details/{orderId}` returns an array with one object,
      // `data.map` will work. If it returns *just the object*, then `data` should be
      // wrapped in an array before mapping, or you need to check if it's an array.
      // For the given example `[...]`, it suggests it's always an array of objects.
      if (!Array.isArray(data)) {
        console.warn("API response for order details was not an array. Assuming single object and converting.");
        // If your API can return a single object, wrap it in an array for consistent mapping
        // Or adjust the mapping logic if it's always a single object directly
        const formattedDetails: OrderDetail[] = [{
          order_id: data.order_id,
          order_date: new Date(data.order_date).toLocaleString(),
          order_status: data.order_status,
          paymentStatus: data.paymentStatus,
          quantity: data.quantity,
          unitPrice: parseFloat(data.unitPrice),
          total: parseFloat(data.total),
          ticketType: data.ticketType,
          eventTitle: data.eventTitle,
          eventDate: data.eventDate,
          eventTime: data.eventTime,
          eventLocation: data.eventLocation,
          eventImage: data.eventImage,
          qr_code: data.qr_code,
          is_scanned: data.is_scanned,
        }];
        setOrderDetails(formattedDetails);
      } else {
        const formattedDetails: OrderDetail[] = data.map((detail: any) => ({
          order_id: detail.order_id,
          order_date: new Date(detail.order_date).toLocaleString(),
          order_status: detail.order_status,
          paymentStatus: detail.paymentStatus,
          quantity: detail.quantity,
          unitPrice: parseFloat(detail.unitPrice),
          total: parseFloat(detail.total),
          ticketType: detail.ticketType,
          eventTitle: detail.eventTitle,
          eventDate: detail.eventDate,
          eventTime: detail.eventTime,
          eventLocation: detail.eventLocation,
          eventImage: detail.eventImage,
          qr_code: detail.qr_code,
          is_scanned: detail.is_scanned,
        }));
        setOrderDetails(formattedDetails);
      }


    } catch (error: any) {
      console.error("Error fetching order details:", error); // Log the full error object
      toast.error(error.message || "An unexpected error occurred while fetching order details.");
      setOrderDetails([]);
    } finally {
      setIsDetailLoading(false);
    }
  }, [token]);

  // --- Effects ---
  useEffect(() => {
    // Only fetch orders if token is available AND API_URL is defined
    if (token && API_URL) {
      fetchOrders();
    } else if (!API_URL) {
      setIsLoading(false); // Stop loading if API_URL is missing
      toast.error("Environment variable NEXT_PUBLIC_API_URL is not set.");
    } else {
      setIsLoading(false); // Stop loading if token is not yet available
    }
  }, [token, fetchOrders]);

  // --- Handlers ---
  const handleViewDetails = (order: Order) => {
    setCurrentOrder(order);
    fetchOrderDetails(order.id);
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsDetailModalOpen(false);
    setCurrentOrder(null);
    setOrderDetails([]);
  };

  // --- Render ---
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-gray-700">
        <p>Loading orders...</p>
      </div>
    );
  }

  // Display an error message if API_URL is missing after initial load
  if (!API_URL) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-red-600">
        <p>Configuration Error: NEXT_PUBLIC_API_URL is not set. Please check your environment variables.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 bg-white overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
      </div>

      {/* Order List */}
      <div className="w-full border border-gray-300 rounded overflow-hidden">
        <div className="grid grid-cols-7 gap-4 bg-gray-200 p-4 text-gray-800 font-bold">
          <span className="text-center">Order ID</span>
          <span>User ID</span>
          <span>Status</span>
          <span>Payment</span>
          <span>Total Amount</span>
          <span>Purchased At</span>
          <span className="text-center">Action</span>
        </div>
        {orders.length === 0 ? (
          <div className="p-4 text-center text-gray-500 bg-white">
            No orders found.
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={order.id}
              className={`grid grid-cols-7 gap-4 items-center p-4 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } border-b border-gray-300 hover:bg-gray-100`}
            >
              <span className="text-center">{order.id}</span>
              <span>{order.user_id} {order.user ? `(${order.user.name})` : ''}</span>
              <span>{order.order_status}</span>
              <span>{order.payment_status}</span>
              <span>${order.total_amount.toFixed(2)}</span>
              <span>{order.purchased_at || 'N/A'}</span>
              <span className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => handleViewDetails(order)}
                  title="View Order Details"
                >
                  <Eye size={18} />
                </Button>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details for Order #{currentOrder?.id}</DialogTitle>
            <DialogDescription>
              Details of tickets purchased in this order.
            </DialogDescription>
          </DialogHeader>

          {isDetailLoading ? (
            <div className="py-8 text-center text-gray-500">
              Loading order items...
            </div>
          ) : orderDetails.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No items found for this order.
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              {/* Order Summary (Optional, but good for context) */}
              {currentOrder && (
                <div className="p-4 border rounded-md bg-gray-50">
                  <h3 className="font-semibold text-lg mb-2">Order Summary:</h3>
                  <p><strong>Order ID:</strong> {currentOrder.id}</p>
                  <p><strong>User:</strong> {currentOrder.user?.name || currentOrder.user_id}</p>
                  <p><strong>Status:</strong> {currentOrder.order_status}</p>
                  <p><strong>Payment:</strong> {currentOrder.payment_status}</p>
                  <p><strong>Total Amount:</strong> ${currentOrder.total_amount.toFixed(2)}</p>
                  <p><strong>Purchased At:</strong> {currentOrder.purchased_at || 'N/A'}</p>
                </div>
              )}

              <h3 className="font-semibold text-lg mt-4 mb-2">Purchased Tickets:</h3>
              <div className="border border-gray-200 rounded overflow-hidden">
                <div className="grid grid-cols-5 gap-2 bg-gray-100 p-2 text-gray-700 font-bold text-sm">
                  <span>Order Item ID</span>
                  <span>Ticket Type</span>
                  <span>Event Title</span>
                  <span>Quantity</span>
                  <span>Price at Purchase</span>
                </div>
                {orderDetails.map((detail, index) => (
                  <div
                    key={detail.qr_code || index} // Use qr_code if unique, fallback to index
                    className="grid grid-cols-5 gap-2 items-center p-2 border-t border-gray-100 text-sm"
                  >
                    <span>{detail.order_id}</span>
                    <span>{detail.ticketType || 'N/A'}</span>
                    <span>{detail.eventTitle || 'N/A'}</span>
                    <span>{detail.quantity}</span>
                    <span>${detail.unitPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}