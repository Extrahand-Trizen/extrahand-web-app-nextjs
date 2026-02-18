"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
   phoneLoginSchema,
   type PhoneLoginFormData,
} from "@/lib/validations/auth";
import { formatPhoneNumber } from "@/lib/utils/phone";
import Image from "next/image";

interface LoginFormProps {
   onSuccess?: (phone: string) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
   const router = useRouter();
   const [isSubmitting, setIsSubmitting] = useState(false);

   const form = useForm<PhoneLoginFormData>({
      resolver: zodResolver(phoneLoginSchema),
      mode: "onChange",
      defaultValues: {
         phone: "",
      },
   });

   const onSubmit = async (data: PhoneLoginFormData) => {
      setIsSubmitting(true);

      try {
         // Simulate API call to send OTP
         await new Promise((resolve) => setTimeout(resolve, 1000));

         const formattedPhone = formatPhoneNumber(data.phone);

         toast.success("OTP sent!", {
            description: `Verification code sent to ${formattedPhone}`,
         });

         if (onSuccess) {
            onSuccess(formattedPhone);
         } else {
            router.push(
               `/otp-verification?phone=${encodeURIComponent(
                  formattedPhone
               )}&type=login`
            );
         }
      } catch {
         toast.error("Failed to send OTP", {
            description: "Please check your phone number and try again.",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   // const handleGoogleLogin = async () => {
   //    setIsSubmitting(true);
   //    try {
   //       await new Promise((resolve) => setTimeout(resolve, 500));
   //       toast.success("Signed in with Google!", {
   //          description: "Redirecting...",
   //       });
   //       router.push("/onboarding/choose-location-method");
   //    } catch {
   //       toast.error("Google sign-in failed", {
   //          description: "Please try again.",
   //       });
   //    } finally {
   //       setIsSubmitting(false);
   //    }
   // };

   return (
      <div className="min-h-screen bg-linear-to-b from-white to-secondary-50 flex flex-col">
         {/* Main Content */}
         <div className="flex-1 flex flex-col items-center justify-center px-0 py-8 lg:px-4">
            <Card className="w-full lg:max-w-md shadow-none border-0 md:border md:shadow-sm bg-transparent">
               <CardHeader className="space-y-4 px-4 lg:px-6">
                  {/* Logo */}
                  <div className="flex items-center justify-center mb-2">
                     <Image
                        src="/assets/images/logo.png"
                        alt="Extrahand"
                        width={55}
                        height={55}
                     />
                  </div>
                  <div className="space-y-2 text-center">
                     <CardTitle className="text-2xl">Welcome back</CardTitle>
                     <CardDescription>
                        Sign in to your ExtraHand account
                     </CardDescription>
                  </div>
               </CardHeader>
               <CardContent className="space-y-6 px-4 lg:px-6">
                  {/* Form */}
                  <Form {...form}>
                     <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                     >
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
                                          autoComplete="tel"
                                          maxLength={10}
                                          {...field}
                                       />
                                    </div>
                                 </FormControl>
                                 <FormMessage />
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
                           Don&apos;t have an account?{" "}
                           <Link
                              href="/signup"
                              className="text-primary-500 hover:underline font-medium"
                           >
                              Sign up
                           </Link>
                        </p>
                     </form>
                  </Form>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
