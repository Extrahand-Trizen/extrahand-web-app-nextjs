import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

/**
 * Notifications list page – shown when user clicks "View all notifications".
 * Replaced with coming-soon until the full notifications page is built.
 */
export default function NotificationsPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-100 flex items-center justify-center">
          <Construction className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
          Coming soon
        </h1>
        {/* <p className="text-secondary-600">
          The full notifications page is under construction. You can still see
          recent notifications in the bell menu. Check back soon!
        </p> */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
