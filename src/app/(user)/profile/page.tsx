// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { getCurrentUser } from "@/lib/auth"
// import { toast } from "sonner"

// export default function ProfilePage() {
//   const router = useRouter()
//   const [user, setUser] = useState<any>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")

//   useEffect(() => {
//     const currentUser = getCurrentUser()
//     if (!currentUser) {
//       router.push("/login")
//       return
//     }

//     setUser(currentUser)
//     setName(currentUser.name || "")
//     setEmail(currentUser.email || "")
//   }, [router])

//   const handleUpdateProfile = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       // Here you would make an API call to update the user profile
//       // For now, we'll just simulate it with a timeout
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       // Update the user in localStorage/sessionStorage
//       const updatedUser = { ...user, name, email }

//       if (localStorage.getItem("user")) {
//         localStorage.setItem("user", JSON.stringify(updatedUser))
//       }

//       if (sessionStorage.getItem("user")) {
//         sessionStorage.setItem("user", JSON.stringify(updatedUser))
//       }

//       setUser(updatedUser)

//       toast.success("Profile updated", {
//         description: "Your profile has been updated successfully.",
//       })
//     } catch (error) {
//       toast.error("Update failed", {
//         description: "Failed to update profile. Please try again.",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (!user) {
//     return <div className="container mx-auto p-8 text-center">Loading...</div>
//   }

//   return (
//     <div className="container mx-auto p-8">
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
//           <CardDescription>View and update your account information</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleUpdateProfile} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
//               />
//             </div>

//             <div className="pt-4">
//               <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white" disabled={isLoading}>
//                 {isLoading ? (
//                   <>
//                     <svg
//                       className="mr-2 h-4 w-4 animate-spin"
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
//                     </svg>
//                     Updating...
//                   </>
//                 ) : (
//                   "Update Profile"
//                 )}
//               </Button>
//             </div>
//           </form>

//           <div className="mt-8 pt-6 border-t">
//             <h3 className="text-lg font-medium mb-4">Account Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">Account ID</p>
//                 <p>{user.id || "N/A"}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Role</p>
//                 <p className="capitalize">{user.role || "User"}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Member Since</p>
//                 <p>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCurrentUser } from "@/lib/auth"
import { toast } from "sonner"

// Define a User type to replace 'any'
interface User {
  id?: string
  name?: string
  email?: string
  role?: string
  created_at?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setName(currentUser.name || "")
    setEmail(currentUser.email || "")
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call to update user profile
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the user in localStorage/sessionStorage
      const updatedUser: User = { ...user, name, email }

      if (localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      if (sessionStorage.getItem("user")) {
        sessionStorage.setItem("user", JSON.stringify(updatedUser))
      }

      setUser(updatedUser)

      toast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
      })
    } catch {
      // Suppress unused error variable by omitting it
      toast.error("Update failed", {
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>
  }

  return (
        <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
          <CardDescription>View and update your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Account ID</p>
                <p>{user.id || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="capitalize">{user.role || "User"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}