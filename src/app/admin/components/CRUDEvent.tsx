// app/dashboard/event-manager/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PlusCircle, Edit, Trash2, XCircle, MapPin, Calendar, Clock, Tag, Users, Upload } from "lucide-react";
import { getAuthToken } from "@/lib/auth";

// Define the API URL from environment variables
const API_BASE_URL = "https://ticket-provider-main-vlftr2.laravel.cloud"; // Assuming this is set up correctly, or use process.env.NEXT_PUBLIC_API_URL if it's dynamic

// Interface for the Event structure based on your NEW API response
interface Event {
    id?: number | string;
    title: string;
    image: string; // This now represents the URL returned by the API
    description: string;
    date: string;
    time: string;
    location: string;
    organizer: string;
    category: string;
    tickets: any[];
    updated_at?: string;
    created_at?: string;
}

// Interface for the form data, adjusted for file upload
interface EventFormData {
    id?: number | string;
    title: string;
    description: string;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    category: string;
    current_image_url: string; // To display existing image when editing
    new_image_file: File | null; // CORRECTED: Allows File or null
    image_preview_url: string | null; // For local preview before upload
}

// --- Helper Functions for Date/Time Conversion ---

// Converts "Month Day, Year" to "YYYY-MM-DD" (for HTML date input)
const parseApiDateToHtmlDate = (apiDateString: string): string => {
    if (!apiDateString) return "";
    const date = new Date(apiDateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
};

// Converts "YYYY-MM-DD" to "Month Day, Year" (for API)
const formatHtmlDateToApiDate = (htmlDateString: string): string => {
    if (!htmlDateString) return "";
    const date = new Date(htmlDateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Converts "9:24 PM - 10:24 PM" to { start_time: "21:24", end_time: "22:24" } (for HTML time inputs)
const parseApiTimeToHtmlTimes = (apiTimeString: string): { start_time: string; end_time: string } => {
    if (!apiTimeString) return { start_time: "", end_time: "" };
    const parts = apiTimeString.split(' - ');
    if (parts.length !== 2) return { start_time: "", end_time: "" };

    const convertTo24Hour = (timePmAm: string): string => {
        const timeParts = timePmAm.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (!timeParts) return "";

        let hours = parseInt(timeParts[1]);
        const minutes = timeParts[2];
        const ampm = timeParts[3] ? timeParts[3].toUpperCase() : '';

        if (ampm === 'PM' && hours !== 12) {
            hours += 12;
        } else if (ampm === 'AM' && hours === 12) {
            hours = 0;
        }
        return `${String(hours).padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    return {
        start_time: convertTo24Hour(parts[0].trim()),
        end_time: convertTo24Hour(parts[1].trim()),
    };
};

// Converts { start_time: "21:24", end_time: "22:24" } to "9:24 PM - 10:24 PM" (for API)
const formatHtmlTimesToApiTime = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return "";

    const convertToPmAm = (time24h: string): string => {
        const [hours, minutes] = time24h.split(':');
        let h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        return `${h}:${minutes} ${ampm}`;
    };

    return `${convertToPmAm(startTime)} - ${convertToPmAm(endTime)}`;
};


export default function EventManagerPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);

    // Modal State for Animation
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Controls if modal is in DOM
    const [animateModal, setAnimateModal] = useState<boolean>(false); // Controls animation classes

    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    // State for the form data (for both creating and editing)
    const [formData, setFormData] = useState<EventFormData>({
        title: "",
        description: "",
        event_date: "",
        start_time: "",
        end_time: "",
        location: "",
        category: "",
        current_image_url: "",
        new_image_file: null,
        image_preview_url: null,
    });

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

    // --- Manage Body Scroll ---
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'; // Disable body scroll
        } else {
            document.body.style.overflow = ''; // Re-enable body scroll
        }

        // Cleanup function to ensure scroll is re-enabled if component unmounts
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);


    // --- Fetch Events (Read) ---
    const fetchEvents = useCallback(async () => {
        if (!token) { // Only proceed if token is available
            setIsLoading(false);
            return;
        }
        if (!API_BASE_URL) {
            toast.error("API_BASE_URL is not defined in environment variables for events.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/events`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                toast.error("Session expired or unauthorized. Please log in again.");
                setEvents([]);
                return;
            }

            if (!response.ok) {
                let errorMessage = `Failed to fetch events: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = `Failed to fetch events: ${errorData.message}`;
                    } else if (errorData) {
                        errorMessage = `Failed to fetch events: ${JSON.stringify(errorData)}`;
                    }
                } catch (parseError) {
                    console.error("Failed to parse error response for events:", parseError);
                }
                throw new Error(errorMessage);
            }

            const data: Event[] = await response.json();
            if (Array.isArray(data)) {
                setEvents(data);
            } else {
                toast.error("Invalid events response format. Expected an array.");
                setEvents([]);
                console.error("API response for events was not an array:", data);
            }
        } catch (error: any) {
            console.error("Error fetching events:", error);
            toast.error(error.message || "An unexpected error occurred while fetching events.");
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    // Fetch events when token becomes available
    useEffect(() => {
        if (token) {
            fetchEvents();
        } else if (token === null) {
            // If token is explicitly null, means getAuthToken failed or returned null
            setIsLoading(false);
        }
    }, [token, fetchEvents]);

    // --- Handle Form Input Changes ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Handle File Input Change ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                new_image_file: file,
                image_preview_url: previewUrl,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                new_image_file: null,
                image_preview_url: null,
            }));
        }
    };

    // --- Open Modal for Create or Edit ---
    const openModal = (event?: Event) => {
        if (event) {
            const { start_time, end_time } = parseApiTimeToHtmlTimes(event.time);
            setEditingEvent(event);
            setFormData({
                id: event.id,
                title: event.title,
                description: event.description,
                event_date: parseApiDateToHtmlDate(event.date),
                start_time: start_time,
                end_time: end_time,
                location: event.location,
                category: event.category,
                current_image_url: event.image,
                new_image_file: null, // Always start with null when opening/editing
                image_preview_url: event.image,
            });
        } else {
            setEditingEvent(null);
            setFormData({
                title: "",
                description: "",
                event_date: "",
                start_time: "",
                end_time: "",
                location: "",
                category: "",
                current_image_url: "",
                new_image_file: null,
                image_preview_url: null,
            });
        }
        setIsModalOpen(true);
        setTimeout(() => setAnimateModal(true), 10);
    };

    // --- Close Modal ---
    const closeModal = () => {
        setAnimateModal(false);
        setTimeout(() => {
            setIsModalOpen(false);
            setEditingEvent(null);
            if (formData.image_preview_url && formData.image_preview_url !== formData.current_image_url) {
                URL.revokeObjectURL(formData.image_preview_url);
            }
        }, 300);
    };

    // --- Handle Form Submission (Create/Update) ---
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !API_BASE_URL) {
            toast.error("Authentication token or API URL is missing.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading(`${editingEvent ? 'Updating' : 'Creating'} event...`);

        try {
            let url = `${API_BASE_URL}/api/events`;
            let method = 'POST';

            const dataToSend = new FormData();
            dataToSend.append('title', formData.title);
            dataToSend.append('description', formData.description);
            dataToSend.append('date', formatHtmlDateToApiDate(formData.event_date));
            dataToSend.append('time', formatHtmlTimesToApiTime(formData.start_time, formData.end_time));
            dataToSend.append('location', formData.location);
            dataToSend.append('category', formData.category);

            if (editingEvent) {
                url = `${API_BASE_URL}/api/events/${editingEvent.id}`;
                method = 'POST'; // Laravel typically uses POST with _method=PUT for file uploads
                dataToSend.append('_method', 'PUT');

                if (formData.new_image_file) {
                    dataToSend.append('image', formData.new_image_file);
                }
                // If editing and no new file, but there was a current image, you might send
                // a flag to keep the old image or simply not send an 'image' field.
                // Assuming not sending 'image' means keeping existing one for PUT requests.
            } else {
                if (formData.new_image_file) {
                    dataToSend.append('image', formData.new_image_file);
                } else {
                    // For creation, an image is likely required. Add validation if so.
                    toast.error("Please select an image for the new event.", { id: toastId });
                    setIsSubmitting(false);
                    return;
                }
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Do NOT set Content-Type for FormData; browser sets it automatically with boundary
                },
                body: dataToSend,
            });

            if (response.status === 401) {
                toast.error("Session expired or unauthorized. Please log in again.", { id: toastId });
                return;
            }

            if (!response.ok) {
                let errorMessage = `Failed to ${editingEvent ? 'update' : 'create'} event: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = `Failed to ${editingEvent ? 'update' : 'create'} event: ${errorData.message}`;
                    } else if (errorData && errorData.errors) {
                        // Laravel validation errors are often in an 'errors' object
                        const validationErrors = Object.values(errorData.errors).flat().join('. ');
                        errorMessage = `Validation failed: ${validationErrors}`;
                    } else if (errorData) {
                        errorMessage = `Failed to ${editingEvent ? 'update' : 'create'} event: ${JSON.stringify(errorData)}`;
                    }
                } catch (parseError) {
                    console.error("Failed to parse error response for event form:", parseError);
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            toast.success(`Event ${editingEvent ? 'updated' : 'created'} successfully!`, { id: toastId });
            closeModal();
            fetchEvents();
        } catch (error: any) {
            console.error(`Error ${editingEvent ? 'updating' : 'creating'} event:`, error);
            toast.error(error.message || `An unexpected error occurred while ${editingEvent ? 'updating' : 'creating'} the event.`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    }, [token, editingEvent, formData, fetchEvents, closeModal]);

    // --- Delete Event ---
    const handleDelete = useCallback(async (eventId: number | string) => {
        if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            return;
        }
        if (!token || !API_BASE_URL) {
            toast.error("Authentication token or API URL is missing.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading(`Deleting event ${eventId}...`);

        try {
            const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                toast.error("Session expired or unauthorized. Please log in again.", { id: toastId });
                return;
            }

            if (!response.ok) {
                let errorMessage = `Failed to delete event: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = `Failed to delete event: ${errorData.message}`;
                    } else if (errorData) {
                        errorMessage = `Failed to delete event: ${JSON.stringify(errorData)}`;
                    }
                } catch (parseError) {
                    console.error("Failed to parse error response for delete event:", parseError);
                }
                throw new Error(errorMessage);
            }

            toast.success("Event deleted successfully!", { id: toastId });
            fetchEvents();
        } catch (error: any) {
            console.error("Error deleting event:", error);
            toast.error(error.message || "An unexpected error occurred while deleting the event.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    }, [token, fetchEvents]);


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-[#2B3674] mb-8">Event Management</h1>

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => openModal()}
                    className="bg-[#4318FF] hover:bg-[#3411CC] text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-md transition-all duration-200"
                >
                    <PlusCircle className="mr-2 h-5 w-5" /> Add New Event
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-lg text-gray-600">Loading events...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-8 text-lg text-gray-600">No events found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col">
                            {/* Event Image */}
                            <div className="relative w-full h-48 sm:h-40 lg:h-48 overflow-hidden">
                                <img
                                    src={event.image || '/images/placeholder-event.png'}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2 bg-gradient-to-r from-[#4318FF] to-[#8643FF] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                    {event.category || 'Uncategorized'}
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-[#2B3674] mb-2 truncate" title={event.title}>{event.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{event.description || 'No description available.'}</p>
                                    <div className="flex items-center text-sm text-gray-500 mt-3">
                                        <Calendar className="mr-2 h-4 w-4 text-[#4318FF]" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <Clock className="mr-2 h-4 w-4 text-[#4318FF]" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <MapPin className="mr-2 h-4 w-4 text-[#4318FF]" />
                                        <span>{event.location}</span>
                                    </div>
                                    {event.organizer && (
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Users className="mr-2 h-4 w-4 text-[#4318FF]" />
                                            <span>Organizer: {event.organizer}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => openModal(event)}
                                        className="flex items-center text-sm text-[#4318FF] hover:text-[#3411CC] mr-4 font-semibold"
                                        title="Edit Event"
                                    >
                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => event.id && handleDelete(event.id)}
                                        className="flex items-center text-sm text-red-600 hover:text-red-800 font-semibold"
                                        title="Delete Event"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Event Modal */}
            {isModalOpen && (
                <div
                    className={`fixed inset-0 flex items-center justify-center z-50 p-4
                                transition-opacity duration-300 ease-in-out
                                ${animateModal ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeModal}
                >
                    <div
                        className={`bg-white rounded-lg shadow-xl w-full max-w-2xl
                                    transform transition-all duration-300 ease-out
                                    ${animateModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                                    max-h-[90vh] flex flex-col`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 flex-shrink-0">
                            <h2 className="text-xl font-semibold text-[#2B3674]">
                                {editingEvent ? "Edit Event" : "Add New Event"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-grow">
                            <form id="event-form" onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#4318FF] focus:border-[#4318FF]"
                                    />
                                </div>

                                {/* --- IMAGE UPLOAD FIELD --- */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>

                                    <div className="flex items-center space-x-4">
                                        <label
                                            htmlFor="imageUpload"
                                            className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
                                            title="Click to upload image"
                                        >
                                            <input
                                                type="file"
                                                name="imageUpload"
                                                id="imageUpload"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <Upload className="h-8 w-8 text-gray-400" />
                                            <span className="mt-1 text-xs text-gray-500 text-center">Upload</span>
                                        </label>

                                        {(formData.image_preview_url || formData.current_image_url) ? (
                                            <div className="flex flex-col items-start min-w-0">
                                                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                                                <img
                                                    src={formData.image_preview_url || formData.current_image_url || '/images/placeholder-event.png'}
                                                    alt="Image Preview"
                                                    className="max-w-full h-24 w-24 object-contain rounded-md border border-gray-200"
                                                />
                                                {formData.new_image_file ? (
                                                    <p className="text-xs text-gray-600 mt-1 truncate w-full" title={formData.new_image_file.name}>New: {formData.new_image_file.name}</p>
                                                ) : editingEvent && formData.current_image_url && (
                                                    <p className="text-xs text-gray-500 mt-1 truncate w-full" title={formData.current_image_url.split('/').pop()}>Current: {formData.current_image_url.split('/').pop()}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400">No image selected</p>
                                        )}
                                    </div>
                                </div>
                                {/* --- END IMAGE UPLOAD FIELD --- */}

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#4318FF] focus:border-[#4318FF]"
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">Event Date</label>
                                    <input
                                        type="date"
                                        name="event_date"
                                        id="event_date"
                                        value={formData.event_date}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#4318FF] focus:border-[#4318FF]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        id="start_time"
                                        value={formData.start_time}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#4318FF] focus:border-[#4318FF]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
                                    <input
                                        type="time"
                                        name="end_time"
                                        id="end_time"
                                        value={formData.end_time}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#4318FF] focus:border-[#4318FF]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        id="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#4318FF] focus:border-[#4318FF]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        id="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#4318FF] focus:border-[#4318FF]"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer (Buttons) */}
                        <div className="flex justify-end p-6 border-t border-gray-200 flex-shrink-0">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="event-form" // Associate button with the form by ID
                                className="px-4 py-2 bg-[#4318FF] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[#3411CC] transition-colors duration-200"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {editingEvent ? "Updating..." : "Creating..."}
                                    </span>
                                ) : (
                                    editingEvent ? "Update Event" : "Create Event"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}