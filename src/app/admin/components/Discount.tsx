"use client";

import React, { useState, useEffect, useCallback } from "react";
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
type Event = {
  id: number;
  event_name: string;
};

type DiscountCode = {
  id: number;
  event_id: number;
  discount_code: string; // This will always be the actual code string
  discount_percentage: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
  event?: { // Optional nested event object from API
    id: number;
    event_name: string;
  };
};

// --- Zod Schema for Validation ---
const discountSchema = z.object({
  event_id: z.number().int().min(1, "Event ID is required and must be a positive number"),
  discount_code: z
    .string()
    .min(1, "Discount code is required")
    .max(50, "Discount code must be less than 50 characters")
    .transform((code) => code.trim()),
  discount_percentage: z.number().min(0, "Discount percentage cannot be negative").max(100, "Discount percentage cannot exceed 100%"),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
}).refine(data => new Date(data.end_date) >= new Date(data.start_date), {
    message: "End date cannot be before start date.",
    path: ["end_date"],
});

// Helper to check for duplicate discount codes for a given event
const checkDuplicateDiscount = (
  code: string,
  eventId: number,
  discountCodes: DiscountCode[],
  currentDiscountId?: number
): boolean => {
  return discountCodes.some(
    (dc) =>
      dc.discount_code.toLowerCase() === code.toLowerCase() &&
      dc.event_id === eventId &&
      dc.id !== currentDiscountId
  );
};

// Ensure API_URL is correctly set.
const API_URL = process.env.NEXT_PUBLIC_API_URL 

export default function DiscountManager() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState<DiscountCode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [eventSearchName, setEventSearchName] = useState<string | null>(null); // State to display event name

  // Form state for creating/editing
  const [formData, setFormData] = useState<
    Omit<DiscountCode, "id" | "created_at" | "updated_at" | "event">
  >({
    event_id: 0,
    discount_code: "",
    discount_percentage: 0,
    start_date: "",
    end_date: "",
  });

  // --- Auth Token Fetch ---


  // --- API Calls ---
const token = getAuthToken();
  // Fetch events.
  const fetchEvents = useCallback(async () => {
    if (!token) {
      console.warn("No token available for fetching events.");
      return;
    }
    try {
      // Use API_URL consistently for all fetches
      const response = await fetch(`${API_URL}/api/events`, { // Corrected endpoint for events
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch events: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast.error(error.message || "Failed to fetch events.");
    }
  }, [token]); // Dependency array includes token

  const fetchDiscountCodes = useCallback(async () => {
    if (!token) {
      toast.error("You must be logged in to view discounts.");
      setIsLoading(false);
      return;
    }
 
    try {
      const response = await fetch(`${API_URL}/api/discounts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to fetch discounts: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();

      const formattedDiscountCodes: DiscountCode[] = data.map((dc: any) => {
        // Find the event details from the 'events' state for display
        const linkedEvent = events.find(e => e.id === dc.event_id);
        return {
          id: dc.id,
          event_id: dc.event_id,
          discount_code: dc.discount_code,
          discount_percentage: parseFloat(dc.discount_percentage),
          start_date: dc.start_date,
          end_date: dc.end_date,
          created_at: new Date(dc.created_at).toLocaleString(),
          updated_at: new Date(dc.updated_at).toLocaleString(),
          // Prioritize nested event data if available from API, otherwise use local lookup
          event: dc.event || linkedEvent,
        };
      });

      setDiscountCodes(formattedDiscountCodes);
    } catch (error: any) {
      console.error("Error fetching discounts:", error);
      toast.error(error.message || "Failed to fetch discounts.");
    } finally {
      setIsLoading(false);
    }
  }, [token, events]); // Dependency array includes token and events

  const createDiscount = async () => {
    if (!token) {
      toast.error("You must be logged in to create a discount.");
      return;
    }

    const validationResult = discountSchema.safeParse(formData);

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    const { event_id, discount_code, discount_percentage, start_date, end_date } = validationResult.data;

    if (checkDuplicateDiscount(discount_code, event_id, discountCodes)) {
      toast.error("A discount code with this name already exists for this event.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/discounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id,
          discount_code,
          discount_percentage: discount_percentage.toFixed(2), // Ensure two decimal places for backend
          start_date,
          end_date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to create discount: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      const newDiscount: DiscountCode = {
        id: result.id,
        event_id: result.event_id,
        discount_code: result.discount_code,
        discount_percentage: parseFloat(result.discount_percentage),
        start_date: result.start_date,
        end_date: result.end_date,
        created_at: new Date(result.created_at).toLocaleString(),
        updated_at: new Date(result.updated_at).toLocaleString(),
        // Find the event name locally if not returned by the API
        event: events.find(e => e.id === result.event_id),
      };

      setDiscountCodes((prev) => [...prev, newDiscount]);
      setIsModalOpen(false);
      resetForm();
      toast.success("Discount created successfully!");
    } catch (error: any) {
      console.error("Error creating discount:", error);
      toast.error(error.message || "An error occurred while creating the discount.");
    }
  };

  const updateDiscount = async () => {
    if (!currentDiscount) return;
    if (!token) {
      toast.error("You must be logged in to update a discount.");
      return;
    }

    const validationResult = discountSchema.safeParse(formData);

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    const { event_id, discount_code, discount_percentage, start_date, end_date } = validationResult.data;

    if (
      checkDuplicateDiscount(discount_code, event_id, discountCodes, currentDiscount.id)
    ) {
      toast.error("A discount code with this name already exists for this event.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/discounts/${currentDiscount.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id,
          discount_code,
          discount_percentage: discount_percentage.toFixed(2), // Ensure two decimal places for backend
          start_date,
          end_date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to update discount: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      const updatedDiscountData: DiscountCode = {
        ...currentDiscount, // Keep existing fields not returned by API (e.g., created_at if not updated)
        id: result.id, // Update ID in case it changes (though unlikely for PUT)
        event_id: result.event_id,
        discount_code: result.discount_code,
        discount_percentage: parseFloat(result.discount_percentage),
        start_date: result.start_date,
        end_date: result.end_date,
        updated_at: new Date(result.updated_at).toLocaleString(),
        // Find the event name locally if not returned by the API
        event: events.find(e => e.id === result.event_id),
      };

      setDiscountCodes((prev) =>
        prev.map((dc) => (dc.id === currentDiscount.id ? updatedDiscountData : dc))
      );

      setIsModalOpen(false);
      setCurrentDiscount(null);
      resetForm();
      toast.success("Discount updated successfully!");
    } catch (error: any) {
      console.error("Error updating discount:", error);
      toast.error(error.message || "An error occurred while updating the discount.");
    }
  };

  const deleteDiscount = async () => {
    if (!currentDiscount) return;
    if (!token) {
      toast.error("You must be logged in to delete a discount.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/discounts/${currentDiscount.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`Failed to delete discount: ${errorData.message || response.statusText}`);
      }

      setDiscountCodes((prev) => prev.filter((dc) => dc.id !== currentDiscount.id));
      setIsDeleteDialogOpen(false);
      setCurrentDiscount(null);
      toast.success("Discount deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting discount:", error);
      toast.error(error.message || "An error occurred while deleting the discount.");
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (token) {
      // Fetch events first, then discount codes, to ensure event names are available
      // Using Promise.all to fetch them concurrently for better performance
      Promise.all([fetchEvents(), fetchDiscountCodes()]).catch(error => {
        console.error("Error during initial data fetch:", error);
        toast.error("Failed to load initial data (events/discounts).");
      });
    } else {
      setIsLoading(false); // If no token, stop loading
    }
  }, [token, fetchEvents, fetchDiscountCodes]); // Added fetchDiscountCodes to dependencies

  // Effect to look up event name when event_id changes in form data
  useEffect(() => {
    const numericEventId = Number(formData.event_id); // Ensure it's a number
    if (numericEventId > 0 && events.length > 0) {
      const foundEvent = events.find(event => event.id === numericEventId);
      setEventSearchName(foundEvent ? foundEvent.event_name : "Event not found");
    } else {
      setEventSearchName(null); // Clear if ID is invalid or 0
    }
  }, [formData.event_id, events]); // Depend on formData.event_id and events

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = {
        ...prev,
        [name]:
          name === "event_id" || name === "discount_percentage" ? Number(value) : value,
      };
      return newState;
    });
  };

  const handleOpenCreateModal = () => {
    setCurrentDiscount(null);
    resetForm(); // Reset form and eventSearchName
    setIsModalOpen(true);
  };

  const handleEditClick = (discount: DiscountCode) => {
    setCurrentDiscount(discount);
    setFormData({
      event_id: discount.event_id,
      discount_code: discount.discount_code,
      discount_percentage: discount.discount_percentage,
      start_date: discount.start_date,
      end_date: discount.end_date,
    });
    // Set eventSearchName immediately for editing mode
    const foundEvent = events.find(e => e.id === discount.event_id);
    setEventSearchName(foundEvent ? foundEvent.event_name : "Event not found");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentDiscount) {
      updateDiscount();
    } else {
      createDiscount();
    }
  };

  const resetForm = () => {
    setFormData({
      event_id: 0,
      discount_code: "",
      discount_percentage: 0,
      start_date: "",
      end_date: "", // Corrected: removed 'sdate'
    });
    setEventSearchName(null); // Crucial: Reset event search name on form reset
  };

  // --- Render ---
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        Loading discounts...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 bg-white overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Discounts</h1>
        <Button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          + Create Discount
        </Button>
      </div>

      {/* Discount List */}
      <div className="w-full border border-gray-300 rounded overflow-hidden">
        <div className="grid grid-cols-7 gap-4 bg-gray-200 p-4 text-gray-800 font-bold">
          <span className="text-center">ID</span>
          <span>Event</span>
          <span>Discount Code</span>
          <span>Discount (%)</span>
          <span>Start Date</span>
          <span>End Date</span>
          <span className="text-center">Action</span>
        </div>
        {discountCodes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 bg-white">
            No discounts found.
          </div>
        ) : (
          discountCodes.map((dc, index) => (
            <div
              key={dc.id}
              className={`grid grid-cols-7 gap-4 items-center p-4 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } border-b border-gray-300 hover:bg-gray-100`}
            >
              <span className="text-center">{dc.id}</span>
              {/* Display event name directly, or 'N/A' if not found */}
              <span>{dc.event?.event_name || 'N/A'}</span>
              <span>{dc.discount_code}</span>
              <span>{dc.discount_percentage.toFixed(2)}%</span>
              <span>{dc.start_date}</span>
              <span>{dc.end_date}</span>
              <span className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => handleEditClick(dc)}
                >
                  <Pencil size={18} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentDiscount(dc);
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

      {/* Create/Edit Discount Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentDiscount ? "Edit Discount" : "Create Discount"}</DialogTitle>
            <DialogDescription>
              {currentDiscount ? "Update the details for this discount." : "Add a new discount for an event."}
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
                // Conditional value: show empty string if 0 AND not editing (to prevent "0" on new form)
                value={formData.event_id === 0 && !currentDiscount ? "" : formData.event_id}
                onChange={handleInputChange}
                required
              />
              {eventSearchName && (
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Event Name:</strong> <span className="font-semibold text-blue-600">{eventSearchName}</span>
                </p>
              )}
            </div>

            {/* Discount Code Input */}
            <div>
              <label htmlFor="discount_code" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Code (e.g., SUMMER20)
              </label>
              <Input
                id="discount_code"
                type="text"
                name="discount_code"
                placeholder="e.g., SUMMER20, FIRSTBUY"
                value={formData.discount_code}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Discount Percentage Input */}
            <div>
              <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage (%)
              </label>
              <Input
                id="discount_percentage"
                type="number"
                name="discount_percentage"
                placeholder="e.g., 10.00"
                value={formData.discount_percentage === 0 && !currentDiscount ? "" : formData.discount_percentage}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="100"
                required
              />
            </div>

            {/* Start Date Input */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                id="start_date"
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* End Date Input */}
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Input
                id="end_date"
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                {currentDiscount ? "Save Changes" : "Create Discount"}
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
              Are you sure you want to delete the discount **"{currentDiscount?.discount_code}"**? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteDiscount}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}