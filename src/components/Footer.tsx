import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50/50 py-12 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Contact Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                  <Phone className="h-4 w-4 text-teal-500" /> {/* Changed from indigo-600 to teal-500 */}
                </div>
                <span className="text-gray-700">602-774-4735</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm mt-1">
                  <MapPin className="h-4 w-4 text-teal-500" /> {/* Changed from indigo-600 to teal-500 */}
                </div>
                <div className="text-gray-700">
                  <p>11022 South 51st Street Suite 105</p>
                  <p>Phoenix, AZ 85044</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                  <Mail className="h-4 w-4 text-teal-500" /> {/* Changed from indigo-600 to teal-500 */}
                </div>
                <span className="text-gray-700">hello@unifiedui.com</span>
              </div>
            </div>
          </div>

          {/* Navigate Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Navigate</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Services
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Discover
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Care
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Download App
                </Link>
              </li>
            </ul>
          </div>

          {/* Solution Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Solution</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Get in Touch
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Technology
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Who're We?
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Expertise
                </Link>
              </li>
            </ul>
          </div>

          {/* Discover Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Discover</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Solution
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Gain Profession
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Career
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Follow Us</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-700 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright and Links */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 mb-4 md:mb-0">
            ©Copyright{" "}
            <Link href="" className="text-teal-500 hover:underline"> {/* Changed from indigo-600 to teal-500 */}
            Tix'Central.com
            </Link>{" "}
            All rights reserved. 2024
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-600 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
              Privacy & Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-teal-500"> {/* Changed from indigo-600 to teal-500 */}
              Terms & Condition
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}