export default function Loading() {
   return (
      <div className="min-h-screen bg-secondary-50">
         {/* Header skeleton */}
         <header className="bg-white border-b border-secondary-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary-200 animate-pulse" />
                  <div className="h-4 w-32 bg-secondary-200 rounded animate-pulse" />
               </div>
               <div className="hidden sm:flex items-center gap-3">
                  <div className="h-8 w-20 bg-secondary-200 rounded-full animate-pulse" />
                  <div className="h-8 w-8 rounded-full bg-secondary-200 animate-pulse" />
               </div>
            </div>
         </header>

         {/* Main content skeleton */}
         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 sm:space-y-6">
            <div className="h-10 w-1/3 max-w-xs bg-secondary-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
               <div className="h-40 sm:h-48 bg-white border border-secondary-100 rounded-2xl shadow-sm animate-pulse" />
               <div className="h-40 sm:h-48 bg-white border border-secondary-100 rounded-2xl shadow-sm animate-pulse" />
            </div>
            <div className="h-64 bg-white border border-secondary-100 rounded-2xl shadow-sm animate-pulse" />
         </main>
      </div>
   );
}

