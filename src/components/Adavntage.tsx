import {
  Rocket,
  Flower2,
  Megaphone,
  Settings2,
  Plus,
  Clock,
} from "lucide-react";

export default function Advantages() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-7xl">
      <h1 className="text-4xl font-bold text-center text-gray-700 mb-16">
        Key Advantages
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Easy Integration */}
        <div className="bg-gray-50 p-8 rounded-xl transition-all duration-300 hover:bg-cyan-600 hover:text-white cursor-pointer group">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-white/20">
            <Rocket className="w-6 h-6 text-cyan-500 transition-colors group-hover:text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3 transition-colors group-hover:text-white">
            Easy Integration
          </h2>
          <p className="text-gray-600 transition-colors group-hover:text-white">
            Our developer friendly APIs, ready-built plugins and integration
            partners can help you launch your business faster.
          </p>
        </div>

        {/* Great Checkout Experience */}
        <div className="bg-gray-50 p-8 rounded-xl transition-all duration-300 hover:bg-cyan-600 hover:text-white cursor-pointer group">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-white/20">
            <Flower2 className="w-6 h-6 text-cyan-500 transition-colors group-hover:text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3 transition-colors group-hover:text-white">
            Great Checkout Experience
          </h2>
          <p className="text-gray-600 transition-colors group-hover:text-white">
            Allow your clients to experience convenient checkout on your website
            or mobile app. Flexible checkout scenarios are available.
          </p>
        </div>

        {/* Campaign Management */}
        <div className="bg-gray-50 p-8 rounded-xl transition-all duration-300 hover:bg-cyan-600 hover:text-white cursor-pointer group">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-white/20">
            <Megaphone className="w-6 h-6 text-cyan-500 transition-colors group-hover:text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3 transition-colors group-hover:text-white">
            Campaign Management
          </h2>
          <p className="text-gray-600 transition-colors group-hover:text-white">
            Running a promotional campaigns got easier with the built-in feature
            and integration into the checkout flow.
          </p>
        </div>

        {/* Customizable Payment Form */}
        <div className="bg-gray-50 p-8 rounded-xl transition-all duration-300 hover:bg-cyan-600 hover:text-white cursor-pointer group">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-white/20">
            <Settings2 className="w-6 h-6 text-cyan-500 transition-colors group-hover:text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3 transition-colors group-hover:text-white">
            Customizable Payment Form
          </h2>
          <p className="text-gray-600 transition-colors group-hover:text-white">
            Create a payment form that meets your company branding and business
            needs.
          </p>
        </div>

        {/* Multiple Payment Methods */}
        <div className="bg-gray-50 p-8 rounded-xl transition-all duration-300 hover:bg-cyan-600 hover:text-white cursor-pointer group">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-white/20">
            <Plus className="w-6 h-6 text-cyan-500 transition-colors group-hover:text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3 transition-colors group-hover:text-white">
            Multiple Payment Methods
          </h2>
          <p className="text-gray-600 transition-colors group-hover:text-white">
            Allow your customers to make payments in various ways, including ABA
            KHQR, Visa, Mastercard, UPI, JCB, Alipay, and WeChat.
          </p>
        </div>

 

        <div className="bg-gray-50 p-8 rounded-xl transition-all duration-300 hover:bg-cyan-600 hover:text-white cursor-pointer group">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-white/20">
            <Clock className="w-6 h-6 text-cyan-500 transition-colors group-hover:text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3 transition-colors group-hover:text-white">
            Multiple Payment Methods
          </h2>
          <p className="text-gray-600 transition-colors group-hover:text-white">
            Allow your customers to make payments in various ways, including ABA
            KHQR, Visa, Mastercard, UPI, JCB, Alipay, and WeChat.
          </p>
        </div>
      </div>
    </main>
  );
}
