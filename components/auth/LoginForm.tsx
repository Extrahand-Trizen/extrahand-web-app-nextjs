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
import { extractIndianMobileNumber, formatPhoneNumber } from "@/lib/utils/phone";
import { authApi } from "@/lib/api/endpoints/auth";
import Image from "next/image";

interface LoginFormProps {
   onSuccess?: (phone: string) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
   const router = useRouter();
   const [redirectTo, setRedirectTo] = useState("/home");
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Resolve post-login redirect from cookie or session storage (no query params).
   React.useEffect(() => {
      if (typeof window !== "undefined") {
         const cookieMatch = document.cookie
            .split("; ")
            .find((cookie) => cookie.startsWith("extrahand_redirect_to="));
         const cookieRedirect = cookieMatch
            ? decodeURIComponent(cookieMatch.split("=")[1])
            : "";
         const sessionRedirect = sessionStorage.getItem("postAuthRedirectTo") || "";

         const baseRedirect = cookieRedirect || sessionRedirect || "/home";

         const context = sessionStorage.getItem("taskCreationContext");
         if (context && baseRedirect === "/tasks/new") {
            try {
               const { category, location } = JSON.parse(context);
               const params = new URLSearchParams();
               if (category) params.append("category", category);
               if (location) params.append("location", location);
               if (params.toString()) {
                  setRedirectTo(`/tasks/new?${params.toString()}`);
               }
               // Clear the context after using it
               sessionStorage.removeItem("taskCreationContext");
            } catch (e) {
               console.error("Failed to parse task creation context", e);
            }
         } else {
            setRedirectTo(baseRedirect);
         }

         // Cleanup redirect hints after reading.
         sessionStorage.removeItem("postAuthRedirectTo");
         document.cookie = "extrahand_redirect_to=; Max-Age=0; Path=/; SameSite=Lax";
      }
   }, []);

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
         // Format phone number
         const formattedPhone = formatPhoneNumber(data.phone);

         // Check if phone exists first so unregistered users see feedback on login page.
         try {
            const digitsOnly = formattedPhone.replace(/\D/g, "");
            const result = await authApi.checkPhone(digitsOnly);
            if (!result?.exists) {
               toast.error("User not registered", {
                  description:
                     "This phone number is not registered. Please sign up.",
               });

               setTimeout(() => {
                  router.push(
                     `/signup?phone=${encodeURIComponent(formattedPhone)}`
                  );
               }, 3000);
               return;
            }
         } catch (checkErr) {
            // Non-blocking: if phone check fails, continue with OTP screen.
            console.warn("Phone check failed during login, continuing", checkErr);
         }

         // Redirect to OTP verification page without showing success message
         // The OTP will be sent on the verification page after checking if user exists
         if (onSuccess) {
            onSuccess(formattedPhone);
         } else {
            // Store redirect destination in cookie so OTP URL stays clean (no ?next= param)
            document.cookie = `extrahand_redirect_to=${encodeURIComponent(redirectTo)}; Path=/; SameSite=Lax`;
            const otpUrl = `/otp-verification?phone=${encodeURIComponent(formattedPhone)}&type=login`;
            router.push(otpUrl);
         }
      } catch {
         toast.error("Failed to proceed", {
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
                        src="/assets/images/logo.webp"
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
                                    <div className="flex items-center gap-2">
                                       <div className="h-10 px-3 rounded-md border border-input bg-muted text-sm text-gray-700 flex items-center">
                                          +91
                                       </div>
                                       <div className="relative flex-1">
                                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                       <Input
                                          placeholder="Enter 10-digit mobile number"
                                          className="pl-10"
                                          autoComplete="tel"
                                          maxLength={10}
                                          type="tel"
                                          inputMode="numeric"
                                          {...field}
                                          value={field.value || ""}
                                          onChange={(e) => {
                                             const normalized = extractIndianMobileNumber(
                                                e.target.value
                                             ).slice(0, 10);
                                             field.onChange(normalized);
                                          }}
                                          onPaste={(e) => {
                                             e.preventDefault();
                                             const pasted =
                                                e.clipboardData.getData("text") || "";
                                             const normalized = extractIndianMobileNumber(
                                                pasted
                                             ).slice(0, 10);
                                             field.onChange(normalized);
                                          }}
                                       />
                                       </div>
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
