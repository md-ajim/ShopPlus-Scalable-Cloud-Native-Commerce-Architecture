'use client'

import { useState } from "react"
import Link from "next/link"
import axios from 'axios'
import { motion, AnimatePresence } from "framer-motion"

// shadcn/ui components
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { toast } from "sonner" // or your preferred toast library

export default function PasswordResetFlow() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    new_password: ''
  })

  const BASE_URL = "http://127.0.0.1:8000/api"

  // Animation Variants for Top-to-Bottom Cascade
  const variants = {
    enter: {
      y: 100, // Starts 100px below the center
      opacity: 0,
    },
    center: {
      y: 0, // Arrives at the final center position
      opacity: 1,
    },
    exit: {
      y: -100, // Exits 100px above the center
      opacity: 0,
    },
  }

  // --- API Handlers ---

  const requestOTP = async () => {
    setLoading(true)
    try {
      await axios.post(`${BASE_URL}/request-reset/`, { email: formData.email })
      toast.success("OTP sent to your email")
      setStep(2)
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    setLoading(true)
    try {
      await axios.post(`${BASE_URL}/verify-reset/`, { 
        email: formData.email, 
        otp: formData.otp 
      })
      toast.success("OTP Verified")
      setStep(3)
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    setLoading(true)
    try {
      await axios.post(`${BASE_URL}/reset-password/`, {
        email: formData.email,
        new_password: formData.new_password
      })
      toast.success("Password updated successfully!")
      // Redirect to login after a short delay
      setTimeout(() => window.location.href = "/login", 2000)
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Reset failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) requestOTP()
    if (step === 2) verifyOTP()
    if (step === 3) resetPassword()
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md overflow-hidden">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {step === 1 && "Reset Password"}
            {step === 2 && "Verify Email"}
            {step === 3 && "New Password"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === 1 && "Enter your email to receive a 6-digit code."}
            {step === 2 && `We've sent a code to ${formData.email}`}
            {step === 3 && "Choose a strong password for your account."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: EMAIL */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Label className="mb-2" htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </motion.div>
              )}

              {/* STEP 2: OTP */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col items-center space-y-4"
                >
                  <Label className="mb-2" >Verification Code</Label>
                  <InputOTP
                    maxLength={6}
                    value={formData.otp}
                    onChange={(val) => setFormData({ ...formData, otp: val })}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-primary underline"
                  >
                    Wrong email? Go back
                  </button>
                </motion.div>
              )}

              {/* STEP 3: NEW PASSWORD */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <Label className="mb-2" htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : step === 3 ? "Reset Password" : "Continue"}
          </Button>
        </form>

        <div className="mt-6 flex justify-center">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}