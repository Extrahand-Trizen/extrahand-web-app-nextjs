export default function TaskDetailsLoading() {
   return (
      <div className="min-h-screen bg-secondary-50">
         {/* Header skeleton */}
         <div className="border-b bg-white">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
               <div className="h-8 w-8 rounded-full bg-secondary-200 animate-pulse" />
               <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-secondary-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-secondary-200 rounded animate-pulse" />
               </div>
            </div>
         </div>

         {/* Main + sidebar skeleton */}
         <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[2fr,minmax(0,1fr)] gap-6">
            <div className="space-y-4">
               <div className="h-40 bg-white border border-secondary-200 rounded-xl animate-pulse" />
               <div className="h-32 bg-white border border-secondary-200 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-4">
               <div className="h-40 bg-white border border-secondary-200 rounded-xl animate-pulse" />
               <div className="h-32 bg-white border border-secondary-200 rounded-xl animate-pulse" />
            </div>
         </div>
      </div>
   );
}
