"use client";

import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { getAuthToken } from "@/lib/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// --- Type Definitions ---
type Event = { // New type for Event data
  id: number;
  event_name: string;
  // Include other event properties if your /api/events endpoint returns them and you need them
  image?: string;
  event_description?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  event_location?: string;
  category_id?: number;
};

type Ticket = {
  id: number;
  event_id: number;
  ticket_name: string;
  price: number;
  quantity_available: number;
  discount: number;
  created_at: string;
  updated_at: string;
  event?: Event; // Now explicitly uses the Event type
};

// Zod Schema for validation
const ticketSchema = z.object({
  event_id: z.number().int().min(1, "Event ID is required and must be a positive number"),
  ticket_name: z
    .string()
    .min(1, "Ticket name is required")
    .max(100, "Ticket name must be less than 100 characters")
    .transform((name) => name.trim()),
  price: z.number().min(0, "Price cannot be negative"),
  quantity_available: z.number().int().min(0, "Quantity cannot be negative"),
  discount: z.number().min(0, "Discount cannot be negative"),
});

// Helper to check for duplicate ticket names for a given event
const checkDuplicateTicketName = (
  name: string,
  eventId: number,
  tickets: Ticket[],
  currentTicketId?: number
): boolean => {
  return tickets.some(
    (ticket) =>
      ticket.ticket_name.toLowerCase() === name.toLowerCase() &&
      ticket.event_id === eventId && // Crucial: check duplicates within the same event
      ticket.id !== currentTicketId
  );
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function TicketManager() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<Event[]>([]); // New state for events
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [eventSearchName, setEventSearchName] = useState<string | null>(null); // To display event name in form

  // Form state for creating/editing
  const [formData, setFormData] = useState<
    Omit<Ticket, "id" | "created_at" | "updated_at" | "event">
  >({
    event_id: 0,
    ticket_name: "",
    price: 0,
    quantity_available: 0,
    discount: 0,
  });

  // --- Auth Token Fetch ---
  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await getAuthToken();
      setToken(savedToken);
    };
    fetchToken();
  }, []);

  // --- API Calls ---

  // New fetch for events
  const fetchEvents = useCallback(async () => {
    if (!token) {
      console.warn("No token available for fetching events.");
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, { // Assuming this is your events endpoint
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch events.");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      // Not showing toast to avoid excessive notifications if event fetch fails
    }
  }, [token]);


  const fetchTickets = async () => {
    if (!token) {
      toast.error("You must be logged in to view ticket types.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ticket-types`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch ticket types: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();

      const formattedTickets: Ticket[] = data.map((ticket: any) => ({
        id: ticket.id,
        event_id: ticket.event_id,
        ticket_name: ticket.ticket_name,
        price: parseFloat(ticket.price),
        quantity_available: ticket.quantity_available,
        discount: parseFloat(ticket.discount),
        created_at: new Date(ticket.created_at).toLocaleString(),
        updated_at: new Date(ticket.updated_at).toLocaleString(),
        // Populate the 'event' object. Prefer nested data from API, otherwise find from 'events' state
        event: ticket.event || events.find(e => e.id === ticket.event_id),
      }));

      setTickets(formattedTickets);
    } catch (error: any) {
      console.error("Error fetching tickets:", error);
      toast.error(error.message || "Failed to fetch ticket types.");
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async () => {
    if (!token) {
      toast.error("You must be logged in to create a ticket type.");
      return;
    }

    const validationResult = ticketSchema.safeParse(formData);

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    const { event_id, ticket_name, price, quantity_available, discount } = validationResult.data;

    if (checkDuplicateTicketName(ticket_name, event_id, tickets)) {
      toast.error("A ticket type with this name already exists for this event.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/ticket-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id,
          ticket_name,
          price: price.toFixed(2),
          quantity_available,
          discount: discount.toFixed(2),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to create ticket type: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      const newTicket: Ticket = {
        id: result.id,
        event_id: result.event_id,
        ticket_name: result.ticket_name,
        price: parseFloat(result.price),
        quantity_available: result.quantity_available,
        discount: parseFloat(result.discount),
        created_at: new Date(result.created_at).toLocaleString(),
        updated_at: new Date(result.updated_at).toLocaleString(),
        event: result.event || events.find(e => e.id === result.event_id), // Include event if returned or find locally
      };

      setTickets((prev) => [...prev, newTicket]);
      setIsModalOpen(false);
      resetForm();
      toast.success("Ticket type created successfully!");
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      toast.error(error.message || "An error occurred while creating the ticket type.");
    }
  };

  const updateTicket = async () => {
    if (!currentTicket) return;
    if (!token) {
      toast.error("You must be logged in to update a ticket type.");
      return;
    }

    const validationResult = ticketSchema.safeParse(formData);

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    const { event_id, ticket_name, price, quantity_available, discount } = validationResult.data;

    if (
      checkDuplicateTicketName(ticket_name, event_id, tickets, currentTicket.id)
    ) {
      toast.error("A ticket type with this name already exists for this event.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/ticket-types/${currentTicket.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id,
          ticket_name,
          price: price.toFixed(2),
          quantity_available,
          discount: discount.toFixed(2),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to update ticket type: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      const updatedTicketData: Ticket = {
        ...currentTicket, // Preserve existing data like 'event'
        id: result.id,
        event_id: result.event_id,
        ticket_name: result.ticket_name,
        price: parseFloat(result.price),
        quantity_available: result.quantity_available,
        discount: parseFloat(result.discount),
        updated_at: new Date(result.updated_at).toLocaleString(),
        event: result.event || events.find(e => e.id === result.event_id) || currentTicket.event, // Re-find or retain
      };

      setTickets((prev) =>
        prev.map((ticket) => (ticket.id === currentTicket.id ? updatedTicketData : ticket))
      );

      setIsModalOpen(false);
      setCurrentTicket(null);
      resetForm();
      toast.success("Ticket type updated successfully!");
    } catch (error: any) {
      console.error("Error updating ticket:", error);
      toast.error(error.message || "An error occurred while updating the ticket type.");
    }
  };

  const deleteTicket = async () => {
    if (!currentTicket) return;
    if (!token) {
      toast.error("You must be logged in to delete a ticket type.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/ticket-types/${currentTicket.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to delete ticket type: ${errorData.message || response.statusText}`);
      }

      setTickets((prev) => prev.filter((ticket) => ticket.id !== currentTicket.id));
      setIsDeleteDialogOpen(false);
      setCurrentTicket(null);
      toast.success("Ticket type deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting ticket:", error);
      toast.error(error.message || "An error occurred while deleting the ticket type.");
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (token) {
      // Fetch events first, then ticket types, to ensure event names are available
      fetchEvents().then(() => {
        fetchTickets();
      });
    } else {
      setIsLoading(false);
    }
  }, [token, fetchEvents]); // Depend on fetchEvents too

  useEffect(() => {
    // When formData.event_id changes, find and set the event name for display
    if (formData.event_id > 0 && events.length > 0) {
      const foundEvent = events.find(event => event.id === formData.event_id);
      setEventSearchName(foundEvent ? foundEvent.event_name : "Event not found");
    } else {
      setEventSearchName(null);
    }
  }, [formData.event_id, events]); // Re-run when event_id or events list changes


  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = {
        ...prev,
        [name]:
          name === "event_id" || name === "price" || name === "quantity_available" || name === "discount"
            ? Number(value)
            : value,
      };
      return newState;
    });
  };

  const handleOpenCreateModal = () => {
    setCurrentTicket(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditClick = (ticket: Ticket) => {
    setCurrentTicket(ticket);
    setFormData({
      event_id: ticket.event_id,
      ticket_name: ticket.ticket_name,
      price: ticket.price,
      quantity_available: ticket.quantity_available,
      discount: ticket.discount,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTicket) {
      updateTicket();
    } else {
      createTicket();
    }
  };

  const resetForm = () => {
    setFormData({
      event_id: 0,
      ticket_name: "",
      price: 0,
      quantity_available: 0,
      discount: 0,
    });
    setEventSearchName(null); // Clear searched event name on form reset
  };

  // --- Render ---
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        Loading ticket types...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 bg-white overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Ticket Types</h1>
        <Button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          + Create Ticket Type
        </Button>
      </div>

      {/* Ticket List */}
      <div className="w-full border border-gray-300 rounded overflow-hidden">
        <div className="grid grid-cols-7 gap-4 bg-gray-200 p-4 text-gray-800 font-bold">
          <span className="text-center">ID</span>
          <span>Event</span>
          <span>Ticket Name</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Discount</span>
          <span className="text-center">Action</span>
        </div>
        {tickets.length === 0 ? (
          <div className="p-4 text-center text-gray-500 bg-white">
            No ticket types found.
          </div>
        ) : (
          tickets.map((ticket, index) => (
            <div
              key={ticket.id}
              className={`grid grid-cols-7 gap-4 items-center p-4 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } border-b border-gray-300 hover:bg-gray-100`}
            >
              <span className="text-center">{ticket.id}</span>
              {/* Display event name directly, or 'N/A' if not found */}
              <span>{ticket.event?.event_name || 'N/A'}</span>
              <span>{ticket.ticket_name}</span>
              <span>${ticket.price.toFixed(2)}</span>
              <span>{ticket.quantity_available}</span>
              <span>${ticket.discount.toFixed(2)}</span>
              <span className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => handleEditClick(ticket)}
                >
                  <Pencil size={18} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentTicket(ticket);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash size={18} />
                </Button>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Ticket Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentTicket ? "Edit Ticket Type" : "Create Ticket Type"}</DialogTitle>
            <DialogDescription>
              {currentTicket ? "Update the details for this ticket type." : "Add a new ticket type for an event."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {/* Event ID Input */}
            <div>
              <label htmlFor="event_id" className="block text-sm font-medium text-gray-700 mb-1">
                Event ID
              </label>
              <Input
                id="event_id"
                type="number"
                name="event_id"
                placeholder="e.g., 123"
                value={formData.event_id === 0 && !currentTicket ? "" : formData.event_id}
                onChange={handleInputChange}
                required
              />
              {eventSearchName && (
                <p className="text-sm text-gray-500 mt-1">
                  **Event Name:** <span className="font-semibold text-blue-600">{eventSearchName}</span>
                </p>
              )}
            </div>

            {/* Ticket Name Input */}
            <div>
              <label htmlFor="ticket_name" className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Name
              </label>
              <Input
                id="ticket_name"
                type="text"
                name="ticket_name"
                placeholder="e.g., VIP Ticket, Early Bird"
                value={formData.ticket_name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Price Input */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <Input
                id="price"
                type="number"
                name="price"
                placeholder="e.g., 25.00"
                value={formData.price === 0 && !currentTicket ? "" : formData.price}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>

            {/* Quantity Available Input */}
            <div>
              <label htmlFor="quantity_available" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Available
              </label>
              <Input
                id="quantity_available"
                type="number"
                name="quantity_available"
                placeholder="e.g., 100"
                value={formData.quantity_available === 0 && !currentTicket ? "" : formData.quantity_available}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Discount Input */}
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                Discount ($)
              </label>
              <Input
                id="discount"
                type="number"
                name="discount"
                placeholder="e.g., 5.00 (optional)"
                value={formData.discount === 0 && !currentTicket ? "" : formData.discount}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                {currentTicket ? "Save Changes" : "Create Ticket Type"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the ticket type "<span className="font-semibold">{currentTicket?.ticket_name}</span>"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteTicket}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}