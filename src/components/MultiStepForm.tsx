"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CheckIcon, InfoIcon, ChevronLeftIcon, ChevronRightIcon, SendIcon } from "lucide-react"
import { Toaster, toast } from "sonner"

// Define the form data type
type FormData = {
  name: string
  dob: string
  address: string
  sex: string
  email: string
  phone: string
  message: string
}

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dob: "",
    address: "",
    sex: "",
    email: "",
    phone: "",
    message: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 3

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {}

    if (step === 1) {
      if (!formData.name) newErrors.name = "Name is required"
      if (!formData.dob) newErrors.dob = "Date of birth is required"
      if (!formData.address) newErrors.address = "Address is required"
      if (!formData.sex) newErrors.sex = "Please select your gender"
      if (!formData.email) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid"
      }
      if (!formData.phone) {
        newErrors.phone = "Phone number is required"
      } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))) {
        newErrors.phone = "Phone number is invalid"
      }
    } else if (step === 2) {
      if (!formData.message) newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log(formData)
      toast.success("Form submitted successfully!")
      // Reset form after submission
      setFormData({
        name: "",
        dob: "",
        address: "",
        sex: "",
        email: "",
        phone: "",
        message: "",
      })
      setCurrentStep(1)
      setIsSubmitting(false)
    }, 1500)
  }

  const updateFormData = (fieldName: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    // Clear error when user types
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }))
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen ">
      <Card className="max-w-3xl mx-auto shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r justify-center  text-white p-8">
          <CardTitle className="text-3xl font-bold text-black tracking-tight">Application Form</CardTitle>
          <CardDescription className="text-gray-500 text-lg mt-2 opacity-90">
            Please complete all steps to submit your application
          </CardDescription>
        </CardHeader>

        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <CardContent className="pt-10 px-10">
          {currentStep === 1 && (
            <PersonalInfoStep formData={formData} updateFormData={updateFormData} errors={errors} />
          )}

          {currentStep === 2 && (
            <MessageStep
              message={formData.message}
              updateMessage={(value) => updateFormData("message", value)}
              error={errors.message}
            />
          )}

          {currentStep === 3 && <ConfirmationStep formData={formData} />}
        </CardContent>

        <CardFooter className="flex justify-between p-8 bg-gray-50 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2 px-5 py-2 text-sm font-medium"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className=" bg-teal-500 hover:bg-teal-600 text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 px-5 py-2 text-sm font-medium"
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-teal-500 text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 px-5 py-2 text-sm font-medium"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <SendIcon className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      <Toaster position="top-center" />
    </div>
  )
}

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="px-8 py-6 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <div
              className={`
              flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-500 
              ${
                index + 1 === currentStep
                  ? "border-teal-500 bg-teal-500 text-white shadow-lg shadow-indigo-200"
                  : index + 1 < currentStep
                    ? "border-teal-600 bg-teal-600 text-white shadow-md shadow-indigo-100"
                    : "border-gray-200 bg-white text-gray-400"
              }
            `}
            >
              {index + 1 < currentStep ? (
                <CheckIcon className="w-6 h-6 text-white" />
              ) : (
                <span className="text-lg font-semibold">{index + 1}</span>
              )}
            </div>
            <span
              className={`text-sm mt-3 font-medium transition-colors duration-300 ${
                index + 1 === currentStep ? "text-teal-500" : "text-gray-500"
              }`}
            >
              {index === 0 ? "Personal Info" : index === 1 ? "Message" : "Confirmation"}
            </span>
          </div>
        ))}
      </div>

      <div className="relative mt-4">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-teal-500 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

interface PersonalInfoStepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: Partial<FormData>
}

function PersonalInfoStep({ formData, updateFormData, errors }: PersonalInfoStepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              placeholder="Enter your full name"
              className={`h-12 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 ${
                errors.name ? "border-red-500" : "border-gray-200 focus:border-teal-500"
              }`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => updateFormData("dob", e.target.value)}
              className={`h-12 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 ${
                errors.dob ? "border-red-500" : "border-gray-200 focus:border-indigo-500"
              }`}
            />
            {errors.dob && <p className="text-sm text-red-500 mt-1">{errors.dob}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData("address", e.target.value)}
              placeholder="Enter your address"
              className={`h-12 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 ${
                errors.address ? "border-red-500" : "border-gray-200 focus:border-teal-500"
              }`}
            />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-medium text-gray-700">
              Gender <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.sex}
              onValueChange={(value) => updateFormData("sex", value)}
              className="flex flex-wrap gap-4 mt-2"
            >
              <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-5 py-3 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm">
                <RadioGroupItem value="male" id="male" className="text-teal-500" />
                <Label htmlFor="male" className="cursor-pointer">
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-5 py-3 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm">
                <RadioGroupItem value="female" id="female" className="text-teal-500" />
                <Label htmlFor="female" className="cursor-pointer">
                  Female
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-5 py-3 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm">
                <RadioGroupItem value="other" id="other" className="text-teal-500" />
                <Label htmlFor="other" className="cursor-pointer">
                  Other
                </Label>
              </div>
            </RadioGroup>
            {errors.sex && <p className="text-sm text-red-500 mt-1">{errors.sex}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              placeholder="Enter your email"
              className={`h-12 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 ${
                errors.email ? "border-red-500" : "border-gray-200 focus:border-teal-500"
              }`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              placeholder="Enter your phone number"
              className={`h-12 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 ${
                errors.phone ? "border-red-500" : "border-gray-200 focus:border-teal-500"
              }`}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MessageStepProps {
  message: string
  updateMessage: (value: string) => void
  error?: string
}

function MessageStep({ message, updateMessage, error }: MessageStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-gray-700">
          Your Message <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => updateMessage(e.target.value)}
          placeholder="Please write your message here..."
          className={`min-h-[240px] rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 ${
            error ? "border-red-500" : "border-gray-200 focus:border-teal-500"
          }`}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  )
}

interface ConfirmationStepProps {
  formData: FormData
}

function ConfirmationStep({ formData }: ConfirmationStepProps) {
  return (
    <div className="space-y-8">
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex items-start space-x-4">
        <InfoIcon className="h-6 w-6 text-teal-500 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-teal-600 text-lg">Privacy Notice</h3>
          <p className="text-teal-500 mt-2 leading-relaxed">
            By submitting this form, you agree to our privacy policy. We collect personal information to process your
            application and may contact you regarding your submission. Your data is securely stored and will not be
            shared with third parties without your consent. You have the right to access, modify, or delete your
            personal information at any time.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-medium mb-5 text-teal-500">Please review your information</h3>

        <Card className="border border-gray-100 shadow-md rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
              <div className="bg-white p-5">
                <p className="text-sm font-medium text-teal-500 mb-1">Full Name</p>
                <p className="text-gray-800 font-medium">{formData.name}</p>
              </div>

              <div className="bg-white p-5">
                <p className="text-sm font-medium text-teal-500 mb-1">Date of Birth</p>
                <p className="text-gray-800 font-medium">{formData.dob}</p>
              </div>

              <div className="bg-white p-5">
                <p className="text-sm font-medium text-teal-500 mb-1">Address</p>
                <p className="text-gray-800 font-medium">{formData.address}</p>
              </div>

              <div className="bg-white p-5">
                <p className="text-sm font-medium text-teal-500 mb-1">Gender</p>
                <p className="text-gray-800 font-medium">{formData.sex.charAt(0).toUpperCase() + formData.sex.slice(1)}</p>
              </div>

              <div className="bg-white p-5">
                <p className="text-sm font-medium text-teal-500 mb-1">Email</p>
                <p className="text-gray-800 font-medium">{formData.email}</p>
              </div>

              <div className="bg-white p-5">
                <p className="text-sm font-medium text-teal-500 mb-1">Phone</p>
                <p className="text-gray-800 font-medium">{formData.phone}</p>
              </div>
            </div>

            <div className="p-5 bg-white border-t border-gray-100">
              <p className="text-sm font-medium text-teal-500 mb-2">Your Message</p>
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{formData.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}