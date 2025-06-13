"use client";

import { useState, useEffect } from "react";
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

interface Category {
  id: number;
  name: string;
  description: string;
  created: string;
  updated: string;
}

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be less than 50 characters")
    .transform((name) => name.trim()),
  description: z.string().optional(),
});

const checkDuplicateName = (
  name: string,
  categories: Category[],
  currentId?: number
): boolean => {
  return categories.some(
    (category) =>
      category.name.toLowerCase() === name.toLowerCase() &&
      category.id !== currentId
  );
};

// Use the environment variable directly, but provide a fallback for safety.
// Ensure NEXT_PUBLIC_API_URL is set in .env.local or deployment config.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://etickets.ticket.publicvm.com";

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryDescription, setNewCategoryDescription] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  // Log API_BASE_URL to confirm it's being read correctly
  useEffect(() => {
    console.log("API Base URL (from env):", API_BASE_URL);
  }, []);

  useEffect(() => {
    const fetchAuthToken = async () => {
      const savedToken = await getAuthToken();
      setToken(savedToken);
      console.log("Auth Token retrieved:", savedToken ? "Present" : "Missing"); // Indicate if token is present
      if (!savedToken) {
        toast.error("Authentication token not found. Please log in.");
        setIsLoading(false); // Stop loading if no token
      }
    };
    fetchAuthToken();
  }, []);

  const fetchCategories = async () => {
    if (!token) {
      toast.error("Authentication required to fetch categories.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Use API_BASE_URL consistently
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorDetail = await response.text(); // Get more detailed error message from response body
        console.error(`Failed to fetch categories: ${response.status} - ${errorDetail}`);
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      const formattedCategories: Category[] = data.map((cat: any) => ({
        id: cat.id,
        name: cat.category_name,
        description: cat.category_description,
        // Ensure dates are valid before calling toLocaleString
        created: cat.created_at ? new Date(cat.created_at).toLocaleString() : 'N/A',
        updated: cat.updated_at ? new Date(cat.updated_at).toLocaleString() : 'N/A',
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(`Failed to fetch categories: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategories();
    } else if (token === null) { // Only set loading to false if token is null, not undefined initially
      setIsLoading(false);
    }
  }, [token]); // Depend on token to re-fetch when it becomes available

  const addCategory = async () => {
    if (!token) {
      toast.error("You must be logged in to add a category.");
      return;
    }

    const validationResult = categorySchema.safeParse({
      name: newCategoryName,
      description: newCategoryDescription,
    });

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    if (checkDuplicateName(validationResult.data.name, categories)) {
      toast.error("A category with this name already exists");
      return;
    }

    try {
      // Use API_BASE_URL consistently
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_name: validationResult.data.name,
          category_description: validationResult.data.description || "",
        }),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        console.error(`Failed to add category: ${response.status} - ${errorDetail}`);
        throw new Error(`Failed to add category: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      const newCat: Category = {
        id: result.id,
        name: result.category_name,
        description: result.category_description,
        created: new Date(result.created_at).toLocaleString(),
        updated: new Date(result.updated_at).toLocaleString(),
      };

      setCategories((prev) => [...prev, newCat]);
      setNewCategoryName("");
      setNewCategoryDescription("");
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(`An error occurred while adding the category: ${(error as Error).message}`);
    }
  };

  const editCategory = async () => {
    if (!currentCategory) return;
    if (!token) {
      toast.error("You must be logged in to update a category.");
      return;
    }

    const validationResult = categorySchema.safeParse({
      name: currentCategory.name,
      description: currentCategory.description,
    });

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    if (
      checkDuplicateName(validationResult.data.name, categories, currentCategory.id)
    ) {
      toast.error("A category with this name already exists");
      return;
    }

    try {
      // Use API_BASE_URL consistently
      const response = await fetch(
        `${API_BASE_URL}/api/categories/${currentCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category_name: validationResult.data.name,
            category_description: validationResult.data.description || "",
          }),
        }
      );

      if (!response.ok) {
        const errorDetail = await response.text();
        console.error(`Failed to update category: ${response.status} - ${errorDetail}`);
        throw new Error(`Failed to update category: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === currentCategory.id
            ? {
                ...cat,
                name: result.category_name,
                description: result.category_description,
                updated: new Date(result.updated_at).toLocaleString(),
              }
            : cat
        )
      );

      setIsEditDialogOpen(false);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(`An error occurred while updating the category: ${(error as Error).message}`);
    }
  };

  const deleteCategory = async () => {
    if (!currentCategory) return;
    if (!token) {
      toast.error("You must be logged in to delete a category.");
      return;
    }

    try {
      // Use API_BASE_URL consistently
      const response = await fetch(
        `${API_BASE_URL}/api/categories/${currentCategory.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorDetail = await response.text();
        console.error(`Failed to delete category: ${response.status} - ${errorDetail}`);
        throw new Error(`Failed to delete category: ${response.status} ${response.statusText}`);
      }

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== currentCategory.id)
      );
      setIsDeleteDialogOpen(false);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(`An error occurred while deleting the category: ${(error as Error).message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        Loading categories...
      </div>
    );
  }

  // If no token and not loading, show a message
  if (!token && !isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-red-500">
        Please log in to manage categories.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 bg-white overflow-auto">
      <div className="flex flex-col md:flex-row items-center mb-4 gap-2">
        <Input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="w-full md:w-80" // Make inputs responsive
          placeholder="Enter category name"
        />
        <Input
          type="text"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
          className="w-full md:w-80" // Make inputs responsive
          placeholder="Enter category description (optional)"
        />
        <Button onClick={addCategory} className="bg-blue-500 text-white w-full md:w-auto">
          Add Category
        </Button>
      </div>

      <div className="w-full border border-gray-300 rounded overflow-hidden shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-gray-200 p-4 text-gray-800 font-bold text-sm">
          <span className="hidden md:block text-center">ID</span> {/* Hide ID on small screens */}
          <span>Name</span>
          <span className="hidden md:block">Description</span> {/* Hide desc on small screens */}
          <span className="hidden lg:block">Created At</span> {/* Hide dates on smaller screens */}
          <span className="hidden lg:block">Updated At</span>
          <span className="text-center">Action</span>
        </div>
        {categories.length === 0 && !isLoading && token ? (
          <div className="p-4 text-center text-gray-500">No categories found. Add a new one!</div>
        ) : (
          categories.map((category, index) => (
            <div
              key={category.id}
              className={`grid grid-cols-2 md:grid-cols-6 gap-4 items-center p-4 text-sm ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } border-b border-gray-300 hover:bg-gray-100`}
            >
              <span className="hidden md:block text-center text-xs text-gray-600">{category.id}</span>
              <span className="font-medium">{category.name}</span>
              <span className="hidden md:block text-gray-700">{category.description || 'N/A'}</span>
              <span className="hidden lg:block text-xs text-gray-500">{category.created}</span>
              <span className="hidden lg:block text-xs text-gray-500">{category.updated}</span>
              <span className="flex justify-center gap-1 md:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentCategory(category);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Pencil size={16} className="text-blue-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentCategory(category);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash size={16} className="text-red-500" />
                </Button>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={currentCategory?.name || ""}
              onChange={(e) =>
                setCurrentCategory((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              placeholder="Category Name"
              aria-label="Category Name"
            />
            <Input
              value={currentCategory?.description || ""}
              onChange={(e) =>
                setCurrentCategory((prev) =>
                  prev ? { ...prev, description: e.target.value } : null
                )
              }
              placeholder="Category Description"
              aria-label="Category Description"
            />
          </div>
          <DialogFooter>
            <Button onClick={editCategory}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category &quot;{currentCategory?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}