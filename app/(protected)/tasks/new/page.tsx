"use client";

/**
 * Post a Task Page
 * Production-ready multi-step task creation flow
 */

import { TaskCreationFlow } from "@/components/tasks/TaskCreationFlow";
import { ReportIssueButton } from "@/components/shared/ReportIssueButton";

export default function PostTaskPage() {
   return (
      <div>
         <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8">
            <ReportIssueButton
               buttonLabel="Report Issue"
               issueType="task"
               pageContext="post-task"
            />
         </div>
         <TaskCreationFlow />
      </div>
   );
}
