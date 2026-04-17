"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Pyramid } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const OTP_EXPIRATION_MINUTES = 10;

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRATION_MINUTES * 60);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
      password: "",
    },
  });

  // OTP countdown timer
  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendOTP = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(' http://127.0.0.1:8000/api/register/', data);
      setUserData({
        username: data.username,
        email: data.email,
      });
      setStep(2);
      setTimeLeft(OTP_EXPIRATION_MINUTES * 60); // Reset timer
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        ...userData
      };

      console.log(payload , 'payload')

      const response = await axios.post('http://127.0.0.1:8000/api/verification/', payload);
      console.log(response, 'response')
      // Store tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Sign in with credentials
      const res = await signIn("credentials", {
        username: response.data.username,
        password: payload.password,
        redirect: false,
      });


      console.log(res, 'res')

      if (res?.ok) {
        toast.success("Registration successful! Welcome to your dashboard");
        router.push("/dashboard");
      } else {
        throw new Error(res?.error || "Authentication failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  
    const handleGoogleSignIn = async () => {
      setIsLoading(true);
      try {
        await signIn("google", { callbackUrl: "/dashboard" });
      } catch (error) {
        toast.error("Google sign in failed");
      } finally {
        setIsLoading(false);
      }
    };
  
  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full max-w-md   border-2 rounded-xl shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">
            {step === 1 ? "Create your account" : "Verify your email"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {step === 1 
              ? "Enter your details to get started" 
              : `Enter the OTP sent to ${userData?.email}`}
          </p>
        </div>
         
        {step === 1 && (
          <>
            <div className="flex justify-center">
              <Button variant="outline"       
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white rounded-md px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
          </>
        )}

        {step === 1 ? (
          <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(handleSendOTP)} className="space-y-4">
              <FormField
                control={signUpForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="john_doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <div className="flex ">
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-sm text-muted-foreground text-center">
                  {timeLeft > 0 
                    ? `Expires in ${formatTime(timeLeft)}` 
                    : "OTP has expired. Please request a new one."}
                </p>
              </div>
              
              <FormField
                control={otpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                              {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            otpForm.setValue('password', e.target.value);
                          }}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || timeLeft <= 0}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center text-sm text-muted-foreground">
          {step === 1 ? (
            <>
              Already have an account?{" "}
              <Link href="/form/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="font-medium text-primary hover:underline"
            >
              Back to sign up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}