"use client";

/**
 * Quick Search / Command Palette
 * Icon-based search with Cmd/Ctrl + K shortcut
 * Mobile-friendly command palette for quick task lookup
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Command } from "lucide-react";
import {
   CommandDialog,
   CommandInput,
   CommandList,
   CommandEmpty,
   CommandGroup,
   CommandItem,
} from "@/components/ui/command";
import type { TaskSnapshotItem } from "@/types/dashboard";

interface QuickSearchProps {
   tasks: TaskSnapshotItem[];
}

export function QuickSearch({ tasks }: QuickSearchProps) {
   const router = useRouter();
   const [open, setOpen] = useState(false);

   // Keyboard shortcut: Cmd/Ctrl + K
   useEffect(() => {
      const down = (e: KeyboardEvent) => {
         if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setOpen((open) => !open);
         }
      };

      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
   }, []);

   return (
      <>
         {/* Mobile-only button */}
         <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Quick Search (Cmd/Ctrl + K)"
         >
            <Search className="w-5 h-5" />
         </button>

         <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search tasks..." />
            <CommandList>
               <CommandEmpty>No tasks found.</CommandEmpty>
               {tasks.length > 0 && (
                  <CommandGroup heading="Your Tasks">
                     {tasks.slice(0, 10).map((task) => (
                        <CommandItem
                           key={task.id}
                           onSelect={() => {
                              router.push(task.nextStepRoute);
                              setOpen(false);
                           }}
                           className="flex items-center justify-between"
                        >
                           <span className="truncate">{task.title}</span>
                           <span className="text-xs text-secondary-500 ml-2 shrink-0">
                              ₹{task.budget}
                           </span>
                        </CommandItem>
                     ))}
                  </CommandGroup>
               )}
               <CommandGroup heading="Quick Actions">
                  <CommandItem
                     onSelect={() => {
                        router.push("/tasks/new");
                        setOpen(false);
                     }}
                  >
                     Post a new task
                  </CommandItem>
                  <CommandItem
                     onSelect={() => {
                        router.push("/tasks");
                        setOpen(false);
                     }}
                  >
                     Browse all tasks
                  </CommandItem>
               </CommandGroup>
            </CommandList>
         </CommandDialog>
      </>
   );
}







