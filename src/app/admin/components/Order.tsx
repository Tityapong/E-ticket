"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Eye, QrCode, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- Type Definitions (Updated) ---
// Since the /api/orders endpoint returns this structure for each item,
// we will use OrderDetail as the type for the main list items.
type OrderDetail = {
  order_id: number; // This will now serve as the primary ID for list items too
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
  order_image: string | null;
  // User data is not part of this specific response object, so we remove it from here.
  // If user data is needed, it would typically come from a separate user endpoint or be joined on the backend.
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrderManager() {
  // `orders` now holds an array of `OrderDetail`
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  // This state is for the single ticket/order item detail dialog
  const [isTicketDetailModalOpen, setIsTicketDetailModalOpen] = useState(false);
  const [currentTicketDetail, setCurrentTicketDetail] = useState<OrderDetail | null>(null);

  // --- Auth Token Fetch ---
  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await getAuthToken();
      setToken(savedToken);
      if (!savedToken) {
        toast.error("Authentication token not found. Please log in.");
        setIsLoading(false);
      }
    };
    fetchToken();
  }, []);

  // --- API Call: Fetch All Order Items ---
  const fetchOrders = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    if (!API_URL) {
      toast.error("API_URL is not defined in environment variables.");
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

      if (response.status === 401) {
        toast.error("Session expired or unauthorized. Please log in again.");
        return;
      }

      if (!response.ok) {
        let errorMessage = `Failed to fetch orders: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = `Failed to fetch orders: ${errorData.message}`;
          } else if (errorData) {
            errorMessage = `Failed to fetch orders: ${JSON.stringify(errorData)}`;
          }
        } catch (parseError) {
          console.error("Failed to parse error response for orders:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("API response for orders is not an array:", data);
        toast.error("Invalid API response format for orders. Expected an array of detailed items.");
        setOrders([]);
        return;
      }

      // Map incoming data directly to OrderDetail type
      const formattedOrders: OrderDetail[] = data.map((item: any) => ({
        order_id: item.order_id,
        order_date: new Date(item.order_date).toLocaleString(), // Format date
        order_status: item.order_status,
        paymentStatus: item.paymentStatus,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice), // Parse to number
        total: parseFloat(item.total), // Parse to number
        ticketType: item.ticketType,
        eventTitle: item.eventTitle,
        eventDate: item.eventDate,
        eventTime: item.eventTime,
        eventLocation: item.eventLocation,
        eventImage: item.eventImage,
        qr_code: item.qr_code,
        is_scanned: item.is_scanned,
        order_image: item.order_image,
      }));

      setOrders(formattedOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error(error.message || "An unexpected error occurred while fetching orders.");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // --- DELETE Order Item Function ---
  // The delete endpoint will still likely operate on a specific order_id.
  // Assuming `DELETE /api/orders/{order_id}` deletes all items associated with that `order_id`
  // OR `DELETE /api/orders/{order_item_id}` if each item has a unique ID for deletion.
  // Based on your sample, `order_id` seems like a group identifier.
  // If `order_id` is unique per row, then we delete by that.
  const handleDeleteOrderItem = useCallback(async (orderIdToDelete: number) => {
    if (!token) {
      toast.error("You must be logged in to delete order items.");
      return;
    }
    if (!API_URL) {
      toast.error("API_URL is not defined for delete operation.");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete order item(s) for Order ID: ${orderIdToDelete}? This action cannot be undone.`);
    if (!confirmDelete) {
      return;
    }

    toast.loading(`Deleting order item(s) for Order ID ${orderIdToDelete}...`, { id: `delete-order-item-${orderIdToDelete}` });

    try {
      // Assuming your backend deletes ALL items associated with the given order_id
      const response = await fetch(`${API_URL}/api/orders/${orderIdToDelete}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error("Session expired or unauthorized. Please log in again.", { id: `delete-order-item-${orderIdToDelete}` });
        return;
      }

      if (!response.ok) {
        let errorMessage = `Failed to delete order item(s) for Order ID ${orderIdToDelete}: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = `Failed to delete order item(s): ${errorData.message}`;
          } else if (errorData) {
            errorMessage = `Failed to delete order item(s): ${JSON.stringify(errorData)}`;
          }
        } catch (parseError) {
          console.error("Failed to parse error response for delete:", parseError);
        }
        throw new Error(errorMessage);
      }

      // Filter out all items with the deleted order_id
      setOrders(prevOrders => prevOrders.filter(item => item.order_id !== orderIdToDelete));
      toast.success(`Order item(s) for Order ID ${orderIdToDelete} deleted successfully!`, { id: `delete-order-item-${orderIdToDelete}` });

    } catch (error: any) {
      console.error("Error deleting order item:", error);
      toast.error(error.message || `An unexpected error occurred while deleting order item(s) for Order ID ${orderIdToDelete}.`, { id: `delete-order-item-${orderIdToDelete}` });
    }
  }, [token]);

  // --- Effects ---
  useEffect(() => {
    if (token && API_URL) {
      fetchOrders();
    } else if (!API_URL) {
      setIsLoading(false);
      toast.error("Environment variable NEXT_PUBLIC_API_URL is not set.");
    } else if (token === null) {
      setIsLoading(false);
    }
  }, [token, fetchOrders]);

  // --- Handlers ---
  // This now directly opens the single ticket detail dialog
  const handleViewTicketDetail = (detail: OrderDetail) => {
    setCurrentTicketDetail(detail);
    setIsTicketDetailModalOpen(true);
  };

  const closeTicketDetailModal = () => {
    setIsTicketDetailModalOpen(false);
    setCurrentTicketDetail(null);
  };

  // --- Render ---
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-gray-700">
        <p>Loading order items...</p>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-800">Order Item Management</h1> {/* Renamed title */}
      </div>

      {/* List of Order Items (Tickets) */}
      <div className="w-full border border-gray-300 rounded overflow-hidden">
        {/* Adjusted columns to display detailed order item properties */}
        <div className="grid grid-cols-8 gap-4 bg-gray-200 p-4 text-gray-800 font-bold">
          <span className="text-center">Order ID</span>
          <span>Event Title</span>
          <span>Ticket Type</span>
          <span className="text-center">Qty</span>
          <span className="text-right">Unit Price</span>
          <span className="text-right">Total Item Price</span>
          <span>Payment Status</span>
          <span className="text-center">Action</span>
        </div>
        {orders.length === 0 ? (
          <div className="p-4 text-center text-gray-500 bg-white">
            No order items found.
          </div>
        ) : (
          orders.map((item, index) => (
            <div
              key={item.qr_code || `${item.order_id}-${index}`} // Using qr_code or composite as unique key
              className={`grid grid-cols-8 gap-4 items-center p-4 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } border-b border-gray-300 hover:bg-gray-100`}
            >
              <span className="text-center">{item.order_id}</span>
              <span>{item.eventTitle || 'N/A'}</span>
              <span>{item.ticketType || 'N/A'}</span>
              <span className="text-center">{item.quantity}</span>
              <span className="text-right">${item.unitPrice.toFixed(2)}</span>
              <span className="text-right">${item.total.toFixed(2)}</span>
              <span>{item.paymentStatus}</span>
              <span className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => handleViewTicketDetail(item)} // View button for detailed item
                  title="View Item Details"
                >
                  <Eye size={18} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteOrderItem(item.order_id)} // Delete button for item's order_id
                  title="Delete Order Item(s)"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </Button>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Dialog for individual Ticket/Order Item Detail */}
      {/* This dialog now serves as the ONLY detail popup */}
      <Dialog open={isTicketDetailModalOpen} onOpenChange={closeTicketDetailModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket/Order Item Details</DialogTitle>
            <DialogDescription>
              Detailed information for this specific ticket or order item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4 text-sm">
            {currentTicketDetail ? (
              <>
                <p><strong>Order ID:</strong> {currentTicketDetail.order_id}</p>
                <p><strong>Order Date:</strong> {currentTicketDetail.order_date}</p>
                <p><strong>Order Status:</strong> {currentTicketDetail.order_status}</p>
                <p><strong>Payment Status:</strong> {currentTicketDetail.paymentStatus}</p>
                <p><strong>Ticket Type:</strong> {currentTicketDetail.ticketType}</p>
                <p><strong>Quantity:</strong> {currentTicketDetail.quantity}</p>
                <p><strong>Unit Price:</strong> ${currentTicketDetail.unitPrice.toFixed(2)}</p>
                <p><strong>Total For Item:</strong> ${currentTicketDetail.total.toFixed(2)}</p>
                <hr className="my-2" />
                <p className="font-semibold">Event Information:</p>
                <p><strong>Title:</strong> {currentTicketDetail.eventTitle}</p>
                <p><strong>Date:</strong> {currentTicketDetail.eventDate}</p>
                <p><strong>Time:</strong> {currentTicketDetail.eventTime}</p>
                <p><strong>Location:</strong> {currentTicketDetail.eventLocation}</p>
                {currentTicketDetail.eventImage && (
                    <div className="mt-2">
                        <strong>Event Image:</strong>
                        <img src={currentTicketDetail.eventImage} alt="Event" className="mt-1 max-w-full h-auto rounded-md" />
                    </div>
                )}
                <hr className="my-2" />
                <p className="font-semibold">Ticket Status:</p>
                <p><strong>QR Code Scanned:</strong> {currentTicketDetail.is_scanned ? 'Yes' : 'No'}</p>
                {currentTicketDetail.qr_code && (
                    <div className="mt-2">
                        <strong>QR Code:</strong>
                        <img src={currentTicketDetail.qr_code} alt="QR Code" className="mt-1 max-w-full h-auto rounded-md" />
                    </div>
                )}
                {/* Note: order_image is in the type but not explicitly displayed here, add if needed */}
              </>
            ) : (
              <p>No ticket details to display.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeTicketDetailModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}