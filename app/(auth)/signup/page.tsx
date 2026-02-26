import { Suspense } from "react";
import { SignupForm } from "@/components/auth";

export default function SignupPage() {
   return (
      <Suspense fallback={null}>
         <SignupForm />
      </Suspense>
   );
}
