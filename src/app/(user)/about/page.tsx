"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export default function AboutUsSection() {
  return (
    <section className="bg-gray-50 py-8 sm:py-12 md:py-16 px-4 sm:px-8 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-700 mb-6 sm:mb-8 md:mb-10">About Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="space-y-4 sm:space-y-6 md:space-y-8 md:pr-4">
            <div>
              <p className="text-base sm:text-lg text-gray-700">
                <span className="font-semibold">ABA PayWay is an all-in-one payment platform</span> developed by ABA
                Bank to help businesses of all sizes across Cambodia to receive payments securely in a modern way, both
                online and offline.
              </p>
            </div>

            <div>
              <p className="text-base sm:text-lg text-gray-700">
                <span className="font-semibold">ABA Bank, Cambodia is leading commercial bank,</span> provides
                individuals and businesses with innovative and reliable financial solutions. With a nationwide presence
                through its extensive branch network, advanced self- banking facilities, and cutting-edge digital
                channels, ABA Bank ensures that customers have seamless access to a full suite of financial services.
              </p>
            </div>

            <div>
              <p className="text-base sm:text-lg text-gray-700">
                ABA Bank is fully owned by the National Bank of Canada.
              </p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden w-full h-full mt-6 md:mt-0">
            <DotLottieReact src="/ani.lottie" loop autoplay className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}

