import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Construction, ArrowRight } from "lucide-react";

interface ComingSoonFeaturePageProps {
  params: Promise<{ feature: string }>;
}

export default async function ComingSoonFeaturePage(props: ComingSoonFeaturePageProps) {
  const params = await props.params;
  const label = params.feature
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-100 flex items-center justify-center">
          <Construction className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
          Page coming soon
        </h1>
        <p className="text-gray-600">
          {label} page is under construction. Please check back soon.
        </p>
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
