"use client";

import React from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

interface IncomeOpportunitiesData {
   jobType: string;
   "1-2"?: string;
   "3-5"?: string;
   "5+"?: string;
}

interface IncomeOpportunitiesSectionProps {
   title?: string;
   description?: string;
   categoryName: string;
   data?: {
      weekly?: IncomeOpportunitiesData[];
      monthly?: IncomeOpportunitiesData[];
      yearly?: IncomeOpportunitiesData[];
   };
   disclaimer?: string;
   selectedPeriod: "weekly" | "monthly" | "yearly";
   onPeriodChange: (period: "weekly" | "monthly" | "yearly") => void;
}

export const IncomeOpportunitiesSection: React.FC<
   IncomeOpportunitiesSectionProps
> = ({
   title,
   description,
   categoryName,
   data,
   disclaimer,
   selectedPeriod,
   onPeriodChange,
}) => {
   if (!data) return null;

   const periodData = data[selectedPeriod];
   const hasData =
      periodData && Array.isArray(periodData) && periodData.length > 0;

   return (
      <section className="py-16 md:py-24 bg-stone-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
               {title && (
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                     {title}
                  </h2>
               )}
               {description && (
                  <p className="text-lg text-slate-600 max-w-2xl">
                     {description}
                  </p>
               )}
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 mb-8">
               {(["weekly", "monthly", "yearly"] as const).map((period) => (
                  <button
                     key={period}
                     onClick={() => onPeriodChange(period)}
                     className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        selectedPeriod === period
                           ? "bg-slate-900 text-white"
                           : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                     }`}
                  >
                     {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
               ))}
            </div>

            {/* Table */}
            {!hasData ? (
               <Card className="border-slate-200">
                  <CardContent className="p-8 text-center">
                     <InfoIcon className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                     <p className="text-slate-600">
                        No data available for {selectedPeriod} period.
                     </p>
                  </CardContent>
               </Card>
            ) : (
               <Card className="border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                     <Table>
                        <TableHeader>
                           <TableRow className="bg-slate-50 border-b border-slate-200">
                              <TableHead className="text-left text-slate-700 font-semibold py-4">
                                 Type of {categoryName} job
                              </TableHead>
                              <TableHead className="text-center text-slate-700 font-semibold py-4">
                                 1-2 tasks/week
                              </TableHead>
                              <TableHead className="text-center text-slate-700 font-semibold py-4">
                                 3-5 tasks/week
                              </TableHead>
                              <TableHead className="text-center text-slate-700 font-semibold py-4">
                                 5+ tasks/week
                              </TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {periodData.map((row, index) => (
                              <TableRow
                                 key={index}
                                 className="hover:bg-slate-50 border-b border-slate-100 last:border-0"
                              >
                                 <TableCell className="py-4 text-slate-900">
                                    {row?.jobType
                                       ? row.jobType.replace(
                                            /accounting/gi,
                                            categoryName
                                         )
                                       : ""}
                                 </TableCell>
                                 <TableCell className="text-center py-4 text-slate-600 font-medium">
                                    {row?.["1-2"] || "-"}
                                 </TableCell>
                                 <TableCell className="text-center py-4 text-slate-600 font-medium">
                                    {row?.["3-5"] || "-"}
                                 </TableCell>
                                 <TableCell className="text-center py-4 text-slate-600 font-medium">
                                    {row?.["5+"] || "-"}
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </div>
               </Card>
            )}

            {/* Disclaimer */}
            {disclaimer && (
               <p className="text-sm text-slate-500 mt-6">
                  {disclaimer.replace(/accounting/gi, categoryName)}
               </p>
            )}
         </div>
      </section>
   );
};
