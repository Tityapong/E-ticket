
"use client"

import React, { useState, useMemo } from "react";
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

const usersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "123456789",
    location: "Phnom Penh",
    joined: "2025-01-15",
    role: "User",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987654321",
    location: "Siem Reap",
    joined: "2025-03-10",
    role: "Supplier",
  },
];

const UserTable = () => {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchEmail, setSearchEmail] = useState("");
  const [users, setUsers] = useState(usersData);

  const generateMonths = () => {
    const months = ["All"];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i);
      months.push(
        date.toLocaleString("default", { month: "long", year: "numeric" })
      );
    }
    return months;
  };

  const locations = useMemo(() => {
    const uniqueLocations = new Set(users.map((u) => u.location));
    return ["All", ...Array.from(uniqueLocations)];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const userDate = new Date(user.joined);
      const userMonth = userDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      return (
        (selectedLocation === "All" || user.location === selectedLocation) &&
        (selectedMonth === "All" || userMonth === selectedMonth) &&
        (searchEmail === "" ||
          user.email.toLowerCase().includes(searchEmail.toLowerCase()))
      );
    });
  }, [users, selectedMonth, selectedLocation, searchEmail]);

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

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map((location) => (
                  <option
                    key={location || "unknown"}
                    value={location || "Unknown"}
                  >
                    {location === "All"
                      ? "All Locations"
                      : location || "Unknown location"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-slate-300">
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Joined
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{user.name}</td>
                    <td className="px-4 py-3 text-gray-700">{user.email}</td>
                    <td className="px-4 py-3 text-gray-700">{user.phone}</td>
                    <td className="px-4 py-3 text-gray-700">{user.location}</td>
                    <td className="px-4 py-3 text-gray-700">{user.joined}</td>
                    <td className="px-4 py-3 text-gray-700">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserTable;
