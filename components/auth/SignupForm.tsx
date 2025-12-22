"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
   ArrowLeft,
   CheckCircle2,
   Loader2,
   Shield,
   Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   phoneAuthSchema,
   type PhoneAuthFormData,
} from "@/lib/validations/auth";
import { formatPhoneNumber } from "@/lib/utils/phone";
import Image from "next/image";

const BENEFITS = [
   "Access to verified local taskers",
   "Secure payments & money-back guarantee",
   "24/7 customer support",
];

interface SignupFormProps {
   onSuccess?: (phone: string, name: string) => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
   const router = useRouter();
   const [isSubmitting, setIsSubmitting] = useState(false);

   const form = useForm<PhoneAuthFormData>({
      resolver: zodResolver(phoneAuthSchema),
      mode: "onChange",
      defaultValues: {
         fullName: "",
         phone: "",
         agreeTerms: false,
      },
   });

   const onSubmit = async (data: PhoneAuthFormData) => {
      setIsSubmitting(true);

      try {
         // Simulate API call to send OTP
         await new Promise((resolve) => setTimeout(resolve, 1000));

         const formattedPhone = formatPhoneNumber(data.phone);

         toast.success("OTP sent!", {
            description: `Verification code sent to ${formattedPhone}`,
         });

         if (onSuccess) {
            onSuccess(formattedPhone, data.fullName);
         } else {
            router.push(
               `/otp-verification?phone=${encodeURIComponent(
                  formattedPhone
               )}&name=${encodeURIComponent(data.fullName)}&type=signup`
            );
         }
      } catch (error) {
         toast.error("Failed to send OTP", {
            description: "Something went wrong. Please try again.",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   // const handleGoogleSignup = async () => {
   //    setIsSubmitting(true);
   //    try {
   //       await new Promise((resolve) => setTimeout(resolve, 500));
   //       toast.success("Signed up with Google!", {
   //          description: "Redirecting...",
   //       });
   //       router.push("/onboarding/choose-location-method");
   //    } catch {
   //       toast.error("Google sign-up failed", {
   //          description: "Please try again.",
   //       });
   //    } finally {
   //       setIsSubmitting(false);
   //    }
   // };

   return (
      <div className="min-h-screen bg-linear-to-b from-white to-secondary-50 flex flex-col">
         {/* Header */}
         <header className="px-4 py-4 lg:px-8">
            <Link
               href="/"
               className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
               <ArrowLeft className="h-4 w-4" />
               Back to home
            </Link>
         </header>

         {/* Main Content */}
         <div className="flex-1 flex items-center justify-center px-4 py-8 lg:py-12">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
               {/* Value Proposition - Hidden on mobile */}
               <div className="hidden lg:block space-y-6">
                  <div className="space-y-3">
                     <Image
                        src="/assets/images/logo.png"
                        alt="Extrahand"
                        width={40}
                        height={40}
                     />
                     <h1 className="text-4xl font-bold text-gray-900">
                        Join ExtraHand Today
                     </h1>
                     <p className="text-lg text-gray-600">
                        Connect with skilled taskers or start earning by helping
                        others.
                     </p>
                  </div>

                  <div className="space-y-4">
                     {BENEFITS.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                           <CheckCircle2 className="h-6 w-6 text-primary-500 shrink-0 mt-0.5" />
                           <p className="text-gray-700">{benefit}</p>
                        </div>
                     ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
                     <Shield className="h-5 w-5 text-primary-500" />
                     <span>Your data is encrypted and secure</span>
                  </div>
               </div>

               {/* Signup Form */}
               <Card className="shadow-xl">
                  <CardHeader className="space-y-4">
                     <div className="flex justify-center">
                        <div className="flex items-center gap-2">
                           <Image
                              src="/assets/images/logo.png"
                              alt="Extrahand"
                              width={35}
                              height={35}
                           />
                           <span className="text-lg font-bold text-gray-900">
                              ExtraHand
                           </span>
                        </div>
                     </div>
                     {/* Logo */}
                     <div className="space-y-2 text-center">
                        <CardTitle className="text-2xl">
                           Create your account
                        </CardTitle>
                        <CardDescription>
                           Sign up with your phone number
                        </CardDescription>
                     </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                     {/* Form */}
                     <Form {...form}>
                        <form
                           onSubmit={form.handleSubmit(onSubmit)}
                           className="space-y-4"
                        >
                           <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                       <Input
                                          placeholder="John Doe"
                                          {...field}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                       <div className="relative">
                                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                          <Input
                                             placeholder="976543210"
                                             className="pl-10"
                                             maxLength={10}
                                             {...field}
                                          />
                                       </div>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name="agreeTerms"
                              render={({ field }) => (
                                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                       <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                          className="[&[data-state=checked]]:bg-primary-500 [&[data-state=checked]]:border-primary-500"
                                       />
                                    </FormControl>
                                    <div className="space-y-1">
                                       <FormLabel className="block text-sm font-normal text-gray-600 leading-snug">
                                          I agree to the{" "}
                                          <Link
                                             href="/terms"
                                             className="text-primary-500 hover:underline"
                                          >
                                             Terms of Service
                                          </Link>{" "}
                                          and{" "}
                                          <Link
                                             href="/privacy"
                                             className="text-primary-500 hover:underline"
                                          >
                                             Privacy Policy
                                          </Link>
                                       </FormLabel>
                                       <FormMessage />
                                    </div>
                                 </FormItem>
                              )}
                           />

                           <Button
                              type="submit"
                              size="lg"
                              className="w-full bg-primary-500 hover:bg-primary-600"
                              disabled={isSubmitting}
                           >
                              {isSubmitting ? (
                                 <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending OTP...
                                 </>
                              ) : (
                                 "Continue"
                              )}
                           </Button>

                           <p className="text-center text-sm text-gray-600">
                              Already have an account?{" "}
                              <Link
                                 href="/login"
                                 className="text-primary-500 hover:underline font-medium"
                              >
                                 Sign in
                              </Link>
                           </p>
                        </form>
                     </Form>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
