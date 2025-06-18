"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const ALLOWED_ROLES = ["admin", "user", "organizer"];

const UserTable = () => {
  const router = useRouter();

  const [selectedMonth, setSelectedMonth] = useState("All");
  const [searchEmail, setSearchEmail] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState("");
  const [isChangingRole, setChangingRole] = useState<number | null>(null);

  const formatUtcToLocal = (utcDateString: string): string => {
    try {
      const date = new Date(utcDateString);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      return date.toLocaleString(undefined, options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return utcDateString;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();
        if (!token) {
          toast.error("Authentication token not found. Please log in.");
          router.push("/login");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          toast.error("Session expired or unauthorized. Please log in again.");
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP error! Status: ${response.status}`;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || JSON.stringify(errorData);
          } catch {
            errorMessage = `${errorMessage} - ${errorText.substring(0, 100)}...`;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        const formattedUsers: User[] = data.users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at,
        }));
        setUsers(formattedUsers);
      } catch (e: any) {
        if (e instanceof TypeError && e.message === "Failed to fetch") {
          console.error(
            `Network Error (Failed to fetch): Check your internet connection, API_URL, and CORS settings on the backend.`
          );
          toast.error("Failed to connect to the server. Check network/CORS.");
        } else {
          console.error("Error fetching users:", e.message);
          toast.error(`Error fetching users: ${e.message}`);
        }
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const openRoleChangeDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedNewRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const handleRoleChangeConfirmation = async () => {
    if (!selectedUser || !selectedNewRole) {
      toast.error("No user or role selected for change.");
      return;
    }
    setChangingRole(selectedUser.id);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        router.push("/login");
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/change-user-role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
      user_id: selectedUser.id,
      new_role: selectedNewRole,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        toast.error("Session expired or unauthorized. Please log in again.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change role");
      }

      const data = await response.json(); // Parse the successful response
      // Update the user's role in the local state using the 'user' object from the API response
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === data.user.id
            ? { ...user, role: data.user.role }
            : user
        )
      );

      setIsRoleDialogOpen(false);
      toast.success(data.message || "Role updated successfully"); // Use message from API
    } catch (err: any) {
      console.error("Error changing role:", err); // Use console.error for errors
      toast.error(err.message || "Failed to update role");
      setError(err.message || "Failed to update role");
    } finally {
      setChangingRole(null);
      setSelectedUser(null);
      setSelectedNewRole("");
    }
  };

  const generateMonths = () => {
    const months = ["All"];
    const yearsInData = Array.from(new Set(users.map(user => new Date(user.created_at).getFullYear())));
    const currentYear = yearsInData.length > 0 ? Math.max(...yearsInData) : new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i);
      months.push(
        date.toLocaleString("en-US", { month: "long", year: "numeric" })
      );
    }
    return months;
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const userCreatedDate = new Date(user.created_at);
      const userMonth = userCreatedDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      return (
        (selectedMonth === "All" || userMonth === selectedMonth) &&
        (searchEmail === "" ||
          user.email.toLowerCase().includes(searchEmail.toLowerCase()))
      );
    });
  }, [users, selectedMonth, searchEmail]);

  if (loading) {
    return <div className="p-4 text-center">Loading users...</div>;
  }

  return (
    <div className="p-4">
      <Card className="w-full max-w-6xl mx-auto">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="relative w-full md:w-[300px]">
              <Input
                type="text"
                placeholder="Search by email..."
                className="pl-10"
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex space-x-4 mt-4 md:mt-0">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {generateMonths().map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">Error</AlertDialogTitle>
                  <AlertDialogDescription>
                    {error}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={() => setError(null)}>Close</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-slate-300">
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Created At
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Updated At
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{user.id}</td>
                    <td className="px-4 py-3 text-gray-700">{user.name}</td>
                    <td className="px-4 py-3 text-gray-700">
                     {user.email.length > 5 ? `${user.email.slice(0, 5)}...` : user.email}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {formatUtcToLocal(user.created_at)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatUtcToLocal(user.updated_at)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRoleChangeDialog(user)}
                        disabled={isChangingRole === user.id}
                        className="w-24 justify-center"
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <AlertDialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the role for{" "}
              <span className="font-semibold">{selectedUser?.name}</span> (
              <span className="font-semibold">{selectedUser?.email}</span>) from{" "}
              <span className="font-semibold">{selectedUser?.role}</span> to:
              <select
                value={selectedNewRole}
                onChange={(e) => setSelectedNewRole(e.target.value)}
                className="ml-2 px-2 py-1 border rounded bg-gray-50"
              >
                {ALLOWED_ROLES.map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                  </option>
                ))}
              </select>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!isChangingRole}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRoleChangeConfirmation}
              disabled={
                !selectedUser ||
                !selectedNewRole ||
                selectedNewRole === selectedUser.role ||
                !!isChangingRole
              }
            >
              {isChangingRole ? "Changing..." : "Change Role"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserTable;