import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Construction, ArrowRight } from "lucide-react";

interface ComingSoonPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ComingSoonPage({ searchParams }: ComingSoonPageProps) {
  const type = typeof searchParams?.type === "string" ? searchParams.type : undefined;
  const labelParam = searchParams?.label;
  const label =
    typeof labelParam === "string"
      ? labelParam
      : Array.isArray(labelParam)
      ? labelParam[0]
      : undefined;

  const isInfoPage = type === "info";

  const title = isInfoPage ? "Page coming soon" : "Coming Soon!";
  const description = isInfoPage
    ? label
      ? `${label} page is under construction. Please check back soon.`
      : "This page is under construction. Please check back soon."
    : "Poster categories are under construction. You can post a task directly and we'll help you find the right tasker.";

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-100 flex items-center justify-center">
          <Construction className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
          {title}
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {!isInfoPage && (
            <Link href="/tasks/new">
              <Button className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold">
                Post a Task
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Button>
            </Link>
          )}
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
