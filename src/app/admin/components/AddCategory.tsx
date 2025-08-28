"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash, PlusCircle, RotateCcw } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a skeleton component for loading states

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
  description: z.string().max(255, "Description must be less than 255 characters").optional(),
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ticket-provider-main-vlftr2.laravel.cloud";

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryDescription, setNewCategoryDescription] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);


  useEffect(() => {
    // console.log("API Base URL (from env):", API_BASE_URL); // Keep for debugging if needed
  }, []);

  const token = getAuthToken();

  const fetchCategories = async () => {

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "GET", // Explicitly added GET method for clarity
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        console.error(`Failed to fetch categories: ${response.status} - ${errorDetail}`);
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      const formattedCategories: Category[] = data.map((cat: any) => ({
        id: cat.id,
        name: cat.category_name,
        description: cat.category_description,
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
    } else if (token === null) {
      setIsLoading(false);
    }
  }, [token]);

  const addCategory = async () => {
    if (!token) {
      toast.error("You must be logged in to add a category.");
      return;
    }
    setIsAdding(true);

    const validationResult = categorySchema.safeParse({
      name: newCategoryName,
      description: newCategoryDescription,
    });

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      setIsAdding(false);
      return;
    }

    if (checkDuplicateName(validationResult.data.name, categories)) {
      toast.error("A category with this name already exists");
      setIsAdding(false);
      return;
    }

    try {
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
    } finally {
      setIsAdding(false);
    }
  };

  const editCategory = async () => {
    if (!currentCategory) return;
    if (!token) {
      toast.error("You must be logged in to update a category.");
      return;
    }
    setIsSaving(true);

    const validationResult = categorySchema.safeParse({
      name: currentCategory.name,
      description: currentCategory.description,
    });

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      setIsSaving(false);
      return;
    }

    if (
      checkDuplicateName(validationResult.data.name, categories, currentCategory.id)
    ) {
      toast.error("A category with this name already exists");
      return;
    }

    try {
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
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCategory = async () => {
    if (!currentCategory) return;
    if (!token) {
      toast.error("You must be logged in to delete a category.");
      return;
    }
    setIsDeleting(true);

    try {
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
    } finally {
      setIsDeleting(false);
    }
  };

  // Render Skeletons during initial loading
  if (isLoading && !token) {
    return (
      <div className="min-h-screen w-full p-6 bg-white overflow-auto">
        <div className="flex flex-col md:flex-row items-center mb-4 gap-2">
          <Skeleton className="w-full md:w-80 h-10" />
          <Skeleton className="w-full md:w-80 h-10" />
          <Skeleton className="w-full md:w-auto h-10" />
        </div>
        <div className="w-full border border-gray-300 rounded overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-gray-200 p-4 text-gray-800 font-bold text-sm">
            <span className="hidden md:block text-center">ID</span>
            <span>Name</span>
            <span className="hidden md:block">Description</span>
            <span className="hidden lg:block">Created At</span>
            <span className="hidden lg:block">Updated At</span>
            <span className="text-center">Action</span>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`grid grid-cols-2 md:grid-cols-6 gap-4 items-center p-4 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-300`}>
              <Skeleton className="hidden md:block w-10 h-4 mx-auto" />
              <Skeleton className="w-24 h-4" />
              <Skeleton className="hidden md:block w-40 h-4" />
              <Skeleton className="hidden lg:block w-32 h-4" />
              <Skeleton className="hidden lg:block w-32 h-4" />
              <div className="flex justify-center gap-1 md:gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no token and not loading, show a message
  if (!token && !isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-red-500 p-6">
        <p className="text-lg font-medium">Please log in to manage categories.</p>
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
          className="w-full md:flex-1"
          placeholder="Enter category name"
          disabled={isAdding}
        />
        <Input
          type="text"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
          className="w-full md:flex-1"
          placeholder="Enter category description (optional)"
          disabled={isAdding}
        />
        <Button
          onClick={addCategory}
          className="bg-blue-500 text-white w-full md:w-auto"
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <RotateCcw className="mr-2 h-4 w-4 animate-spin" /> Adding...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Category
            </>
          )}
        </Button>
        <Button
          onClick={fetchCategories}
          className="bg-gray-500 text-white w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RotateCcw className="mr-2 h-4 w-4 animate-spin" /> Refreshing...
            </>
          ) : (
            <>
              <RotateCcw className="mr-2 h-4 w-4" /> Refresh
            </>
          )}
        </Button>
      </div>

      <div className="w-full border border-gray-300 rounded overflow-hidden shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-gray-200 p-4 text-gray-800 font-bold text-sm">
          <span className="hidden md:block text-center">ID</span>
          <span>Name</span>
          <span className="hidden md:block">Description</span>
          <span className="hidden lg:block">Created At</span>
          <span className="hidden lg:block">Updated At</span>
          <span className="text-center">Action</span>
        </div>
        {isLoading && token ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`grid grid-cols-2 md:grid-cols-6 gap-4 items-center p-4 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-300`}>
              <Skeleton className="hidden md:block w-10 h-4 mx-auto" />
              <Skeleton className="w-24 h-4" />
              <Skeleton className="hidden md:block w-40 h-4" />
              <Skeleton className="hidden lg:block w-32 h-4" />
              <Skeleton className="hidden lg:block w-32 h-4" />
              <div className="flex justify-center gap-1 md:gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </div>
          ))
        ) : categories.length === 0 ? (
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
                  aria-label={`Edit ${category.name}`}
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
                  aria-label={`Delete ${category.name}`}
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
              disabled={isSaving}
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
              disabled={isSaving}
            />
          </div>
          <DialogFooter>
            <Button onClick={editCategory} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
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
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteCategory} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}