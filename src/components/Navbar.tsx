// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"

// export default function Navbar() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const pathname = usePathname()

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen((prev) => !prev)
//   }

//   // Function to determine if a link is active
//   const isActive = (path: string) => {
//     return pathname === path
//   }

//   // Function to get link classes with active state
//   const getLinkClasses = (path: string) => {
//     return isActive(path) ? "text-teal-500 font-medium" : "text-slate-700 hover:text-teal-500 transition-colors"
//   }

//   return (
//     <header className="container w-full mx-auto py-4 px-4 flex items-center justify-between relative z-50">
//       {/* Logo */}
//       <div className="flex items-center">
//         <Link href="/" className="text-2xl font-bold">
//           <span className="text-slate-700">Tix</span>
//           <span className="text-teal-500">'Central</span>
//         </Link>
//       </div>

     
//       <nav className="hidden md:flex items-center space-x-8">
//         <Link href="/products" className={getLinkClasses("/products")}>
//           Products
//         </Link>
//         <Link href="/services" className={getLinkClasses("/services")}>
//           Services
//         </Link>
//         <Link href="/about" className={getLinkClasses("/about")}>
//           About Us
//         </Link>
//         <Link href="/apply" className={getLinkClasses("/apply")}>
//           Apply Now
//         </Link>
//       </nav>

//       {/* Desktop Login Button */}
//       <div className="hidden md:flex items-center">
//         <Link
//           href="/login"
//           className={`px-6 py-2 border border-teal-500 rounded-md ${
//             isActive("/login") ? "bg-teal-500 text-white" : "text-teal-500 hover:bg-teal-500 hover:text-white"
//           } transition-colors`}
//         >
//           Login
//         </Link>
//       </div>

//       {/* Mobile Controls (Login + Menu Trigger) */}
//       <div className="md:hidden flex items-center space-x-3">
//         <Link
//           href="/login"
//           className={`px-4 py-1 border border-teal-500 rounded-md text-sm ${
//             isActive("/login") ? "bg-teal-500 text-white" : "text-teal-500 hover:bg-teal-500 hover:text-white"
//           } transition-colors`}
//         >
//           Login
//         </Link>
//         <button
//           onClick={toggleMobileMenu}
//           className="text-slate-700 focus:outline-none"
//           aria-label="Toggle mobile menu"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             {isMobileMenuOpen ? (
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             ) : (
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
//             )}
//           </svg>
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md border-t">
//           <nav className="flex flex-col items-center py-4 space-y-4">
//             <Link href="/products" className={getLinkClasses("/products")} onClick={toggleMobileMenu}>
//               Products
//             </Link>
//             <Link href="/services" className={getLinkClasses("/services")} onClick={toggleMobileMenu}>
//               Services
//             </Link>
//             <Link href="/about" className={getLinkClasses("/about")} onClick={toggleMobileMenu}>
//               About Us
//             </Link>
//             <Link href="/apply" className={getLinkClasses("/apply")} onClick={toggleMobileMenu}>
//               Apply Now
//             </Link>
//           </nav>
//         </div>
//       )}
//     </header>
//   )
// }





"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, User, ChevronDown } from "lucide-react"
import { getCurrentUser, logout, AUTH_CHANGE_EVENT } from "@/lib/auth"
import { toast } from "sonner"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Function to update user state
  const updateUserState = () => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }

  useEffect(() => {
    // Check if user is logged in on component mount
    updateUserState()

    // Listen for auth state changes
    window.addEventListener(AUTH_CHANGE_EVENT, updateUserState)

    // Also check when window gets focus (in case of login/logout in another tab)
    window.addEventListener("focus", updateUserState)

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, updateUserState)
      window.removeEventListener("focus", updateUserState)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev)
  }

  const handleLogout = () => {
    logout()
    setIsProfileMenuOpen(false)
    toast.success("Logged out successfully", {
      description: "You have been logged out of your account.",
    })
    router.push("/login")
  }

  // Function to determine if a link is active
  const isActive = (path: string) => {
    return pathname === path
  }

  // Function to get link classes with active state
  const getLinkClasses = (path: string) => {
    return isActive(path) ? "text-teal-500 font-medium" : "text-slate-700 hover:text-teal-500 transition-colors"
  }

  return (
    <header className="container w-full mx-auto py-4 px-4 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-slate-700">Tix</span>
          <span className="text-teal-500">'Central</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/products" className={getLinkClasses("/products")}>
          Products
        </Link>
        <Link href="/services" className={getLinkClasses("/services")}>
          Services
        </Link>
        <Link href="/about" className={getLinkClasses("/about")}>
          About Us
        </Link>
        <Link href="/apply" className={getLinkClasses("/apply")}>
          Apply Now
        </Link>
      </nav>

      {/* Desktop Login/Profile Button */}
      <div className="hidden md:flex items-center">
        {user ? (
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 px-4 py-2 border border-teal-500 rounded-md text-teal-500 hover:bg-teal-500 hover:text-white transition-colors"
            >
              <User className="h-4 w-4" />
              <span>{user.name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className={`px-6 py-2 border border-teal-500 rounded-md ${
              isActive("/login") ? "bg-teal-500 text-white" : "text-teal-500 hover:bg-teal-500 hover:text-white"
            } transition-colors`}
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Controls (Login/Profile + Menu Trigger) */}
      <div className="md:hidden flex items-center space-x-3">
        {user ? (
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-1 px-3 py-1 border border-teal-500 rounded-md text-sm text-teal-500"
            >
              <User className="h-3 w-3" />
              <span className="max-w-[80px] truncate">{user.name}</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className={`px-4 py-1 border border-teal-500 rounded-md text-sm ${
              isActive("/login") ? "bg-teal-500 text-white" : "text-teal-500 hover:bg-teal-500 hover:text-white"
            } transition-colors`}
          >
            Login
          </Link>
        )}

        <button
          onClick={toggleMobileMenu}
          className="text-slate-700 focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md border-t">
          <nav className="flex flex-col items-center py-4 space-y-4">
            <Link href="/products" className={getLinkClasses("/products")} onClick={toggleMobileMenu}>
              Products
            </Link>
            <Link href="/services" className={getLinkClasses("/services")} onClick={toggleMobileMenu}>
              Services
            </Link>
            <Link href="/about" className={getLinkClasses("/about")} onClick={toggleMobileMenu}>
              About Us
            </Link>
            <Link href="/apply" className={getLinkClasses("/apply")} onClick={toggleMobileMenu}>
              Apply Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
