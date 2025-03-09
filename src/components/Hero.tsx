
// import Link from "next/link"
// import { Globe } from "lucide-react"

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-white">
//       <header className="container mx-auto px-4 py-4 flex items-center justify-between">
//         <div className="flex items-center">
//           <Link href="/" className="flex items-center">
//             <span className="text-[#2d5b6b] font-bold text-2xl">ABA'</span>
//             <span className="text-[#2d5b6b] font-bold italic text-2xl">PAY</span>
//             <span className="text-[#37bed5] font-bold italic text-2xl">WAY</span>
//           </Link>
//         </div>

//         <nav className="hidden md:flex items-center space-x-8">
//           <Link href="#products" className="text-gray-800 hover:text-[#5dc0d1] font-medium">
//             Products
//           </Link>
//           <Link href="#developers" className="text-gray-800 hover:text-[#5dc0d1] font-medium">
//             Developers
//           </Link>
//           <Link href="#about" className="text-gray-800 hover:text-[#5dc0d1] font-medium">
//             About Us
//           </Link>
//           <Link href="#apply" className="text-gray-800 hover:text-[#5dc0d1] font-medium">
//             Apply Now
//           </Link>
//         </nav>

//         <div className="flex items-center space-x-4">
//           <button className="p-2 border border-[#5dc0d1] rounded-md text-[#5dc0d1]">
//             <Globe size={20} />
//           </button>
//           <button className="px-6 py-2 border border-[#37bed5] rounded-md text-[#5dc0d1] hover:bg-[#37bed5] hover:text-white transition-colors">
//             Login
//           </button>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-16">
//         <div className="flex flex-col md:flex-row items-center">
//           <div className="md:w-1/2 mb-10 md:mb-0">
//             <h1 className="text-5xl md:text-6xl font-bold text-[#4a4a4a] mb-2">Payment Solution</h1>
//             <h2 className="text-5xl md:text-6xl font-bold text-[#37bed5] mb-6">All-In-One</h2>
//             <p className="text-lg text-gray-700 mb-8 max-w-md">
//               Boost your sales by providing seamless payment experience to your clients.
//             </p>
//             <button className="px-8 py-4 bg-[#5dc0d1] text-white rounded-md hover:bg-[#4ba3b3] transition-colors">
//               Explore Now
//             </button>
//           </div>

//           <div className="md:w-1/2">
//             <video
//               src="/animate.mp4"
//               width={600}
//               height={450}
//               className="w-full h-auto rounded-lg"
//               autoPlay
//               loop
//               muted
//               playsInline
//               controls
//             />
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }


"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function Hero() {
  const [showNewSvg, setShowNewSvg] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNewSvg((prev) => !prev)
    }, 3000) // Switch every 3 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="flex-1 container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-700">
          Service Solution
          <div className="text-teal-500">All-In-One</div>
        </h1>
        <p className="text-lg text-slate-600 max-w-md">
          Boost your sales by providing seamless payment experience to your clients.
        </p>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 rounded-md text-lg">Explore Now</Button>
      </div>

      <div className="md:w-1/2 mt-12 md:mt-0">
        <div className="relative  w-full h-[400px]">
          <style jsx>{`
            /* Original animations */
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-10px); }
              60% { transform: translateY(-5px); }
            }
            @keyframes slideIn {
              from { transform: translate(-150px, 100px) rotate(-15deg) translateX(-100px); }
              to { transform: translate(-150px, 100px) rotate(-15deg); }
            }
            @keyframes pulse {
              0% { opacity: 0.3; }
              50% { opacity: 1; }
              100% { opacity: 0.3; }
            }
            @keyframes scooterMove {
              0% { transform: translate(-250px, -100px) translateX(-20px); }
              50% { transform: translate(-250px, -100px) translateX(20px); }
              100% { transform: translate(-250px, -100px) translateX(-20px); }
            }
            .payment-terminal { animation: bounce 2s infinite; }
            .credit-card { animation: slideIn 1.5s ease-out forwards; }
            .connection-lines { animation: pulse 2s infinite; }
            .delivery-scooter { animation: scooterMove 3s infinite; }
            .mobile-phone { animation: bounce 2s infinite 0.5s; }

            /* New SVG animations for ticket theme */
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes ticketSlide {
              0% { transform: translateY(20px); }
              50% { transform: translateY(-10px); }
              100% { transform: translateY(20px); }
            }
            @keyframes pulseCheck {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
            @keyframes swayBarcode {
              0% { transform: translateX(-5px); }
              50% { transform: translateX(5px); }
              100% { transform: translateX(-5px); }
            }
            @keyframes glow {
              0% { opacity: 0.5; }
              50% { opacity: 1; }
              100% { opacity: 0.5; }
            }

            .new-svg { animation: fadeIn 1s ease-in; }
            .ticket-stub { animation: ticketSlide 2s infinite ease-in-out; }
            .pulse-check { animation: pulseCheck 1.5s infinite; }
            .sway-barcode { animation: swayBarcode 2s infinite; }
            .glow-text { animation: glow 2s infinite; }
          `}</style>

          {!showNewSvg ? (
            <svg viewBox="0 0 800 600" className="w-full h-full" aria-hidden="true">
              <g transform="translate(400, 300) scale(0.8)">
                {/* Original SVG content */}
                <g className="payment-terminal">
                  <rect x="100" y="-50" width="120" height="180" rx="10" fill="#f0f4f8" stroke="#d1dce5" strokeWidth="2" />
                  <rect x="120" y="-30" width="80" height="50" rx="5" fill="#e1f5fe" />
                  <rect x="130" y="40" width="20" height="10" rx="2" fill="#90caf9" />
                  <rect x="160" y="40" width="20" height="10" rx="2" fill="#90caf9" />
                  <rect x="130" y="60" width="20" height="10" rx="2" fill="#90caf9" />
                  <rect x="160" y="60" width="20" height="10" rx="2" fill="#90caf9" />
                  <rect x="130" y="80" width="50" height="15" rx="2" fill="#4fc3f7" />
                </g>
                <rect x="-50" y="-50" width="120" height="120" rx="10" fill="#f0f4f8" stroke="#d1dce5" strokeWidth="2" />
                <text x="-15" y="15" fontSize="40" fontWeight="bold" fill="#4fc3f7">PW</text>
                <g className="credit-card">
                  <rect width="120" height="80" rx="10" fill="#f0f4f8" stroke="#d1dce5" strokeWidth="2" />
                  <rect x="10" y="15" width="40" height="10" rx="2" fill="#90caf9" />
                  <rect x="10" y="50" width="80" height="5" rx="2" fill="#90caf9" />
                </g>
                <g className="mobile-phone" transform="translate(250, -150) rotate(15)">
                  <rect width="70" height="140" rx="10" fill="#f0f4f8" stroke="#d1dce5" strokeWidth="2" />
                  <rect x="5" y="10" width="60" height="100" rx="2" fill="#e1f5fe" />
                  <circle cx="35" cy="125" r="10" fill="#e1e1e1" />
                </g>
                <g className="delivery-scooter">
                  <circle cx="0" cy="0" r="25" fill="#4fc3f7" />
                  <rect x="-15" y="-10" width="30" height="20" rx="5" fill="#f0f4f8" />
                  <circle cx="-25" cy="20" r="15" fill="#90caf9" />
                  <circle cx="25" cy="20" r="15" fill="#90caf9" />
                </g>
                <g transform="translate(-150, 200) rotate(-10)">
                  <rect width="150" height="100" rx="5" fill="#f0f4f8" stroke="#d1dce5" strokeWidth="2" />
                  <rect x="5" y="5" width="140" height="80" rx="2" fill="#e1f5fe" />
                  <rect x="20" y="100" width="110" height="10" rx="5" fill="#d1dce5" />
                </g>
                <g transform="translate(200, 150)">
                  <rect width="100" height="80" rx="5" fill="#f0f4f8" stroke="#d1dce5" strokeWidth="2" />
                  <rect x="0" y="60" width="100" height="20" fill="#4fc3f7" />
                  <rect x="40" y="30" width="20" height="30" fill="#e1f5fe" />
                  <rect x="0" y="0" width="100" height="10" fill="#ff5252" strokeWidth="2" strokeDasharray="5,5" stroke="#ffffff" />
                </g>
                <path
                  className="connection-lines"
                  d="M-50 50 L 100 50 M-150 100 L -50 0 M-150 200 L 0 50 M100 50 L 250 -100 M100 50 L 200 150"
                  stroke="#d1dce5"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  fill="none"
                />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 800 600" className="w-full h-full new-svg" aria-hidden="true">
              <g transform="translate(400, 300) scale(0.8)">
                {/* New SVG content: Ticket purchase confirmation */}
                {/* Ticket stub background */}
                <rect
                  x="-150"
                  y="-100"
                  width="300"
                  height="200"
                  rx="10"
                  fill="#ffffff"
                  stroke="#4fc3f7"
                  strokeWidth="4"
                  strokeDasharray="10,5"
                  className="ticket-stub"
                />
                {/* Perforated edge effect */}
                <path
                  d="M-150 0 H 150"
                  stroke="#d1dce5"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="sway-barcode"
                />
                {/* Event title */}
                <text
                  x="-120"
                  y="-40"
                  fontSize="30"
                  fontWeight="bold"
                  fill="#4fc3f7"
                  className="glow-text"
                >
                  Ticket Confirmed
                </text>
                {/* Barcode-like lines */}
                <g className="sway-barcode">
                  <rect x="20" y="20" width="10" height="40" fill="#90caf9" />
                  <rect x="40" y="20" width="5" height="40" fill="#90caf9" />
                  <rect x="55" y="20" width="15" height="40" fill="#90caf9" />
                  <rect x="75" y="20" width="5" height="40" fill="#90caf9" />
                  <rect x="90" y="20" width="10" height="40" fill="#90caf9" />
                </g>
                {/* Checkmark */}
                <g className="pulse-check" transform="translate(120, -60) scale(1.5)">
                  <circle cx="0" cy="0" r="20" fill="#4fc3f7" />
                  <path d="M-10 -5 L-2 5 L10 -10" stroke="#fff" strokeWidth="4" fill="none" />
                </g>
              
              </g>
            </svg>
          )}
        </div>
      </div>
    </main>
  )
}