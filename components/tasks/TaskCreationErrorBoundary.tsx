"use client";

/**
 * Error Boundary for Task Creation Flow
 * Catches and displays errors gracefully in production
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
   children: ReactNode;
   fallback?: ReactNode;
}

interface ErrorBoundaryState {
   hasError: boolean;
   error: Error | null;
   errorInfo: ErrorInfo | null;
}

export class TaskCreationErrorBoundary extends Component<
   ErrorBoundaryProps,
   ErrorBoundaryState
> {
   constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = {
         hasError: false,
         error: null,
         errorInfo: null,
      };
   }

   static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return {
         hasError: true,
         error,
         errorInfo: null,
      };
   }

   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error("Task Creation Error:", error, errorInfo);
      this.setState({
         error,
         errorInfo,
      });

      // TODO: Send error to logging service (e.g., Sentry, LogRocket)
      // logErrorToService(error, errorInfo);
   }

   handleReset = () => {
      this.setState({
         hasError: false,
         error: null,
         errorInfo: null,
      });

      // Reload the page to reset state
      window.location.reload();
   };

   render() {
      if (this.state.hasError) {
         // Custom fallback UI
         if (this.props.fallback) {
            return this.props.fallback;
         }

         // Default fallback UI
         return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
               <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                     <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                     Oops! Something went wrong
                  </h2>

                  <p className="text-gray-600 mb-6">
                     We encountered an unexpected error while processing your
                     task. Don't worry, your data is safe.
                  </p>

                  {process.env.NODE_ENV === "development" &&
                     this.state.error && (
                        <details className="mb-6 text-left">
                           <summary className="cursor-pointer text-sm text-gray-700 font-medium mb-2">
                              Error Details (Dev Only)
                           </summary>
                           <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-40">
                              {this.state.error.toString()}
                              {"\n"}
                              {this.state.errorInfo?.componentStack}
                           </pre>
                        </details>
                     )}

                  <div className="space-y-3">
                     <Button
                        onClick={this.handleReset}
                        className="w-full h-12"
                        size="lg"
                     >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Try Again
                     </Button>

                     <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/")}
                        className="w-full h-12"
                        size="lg"
                     >
                        Go to Home
                     </Button>
                  </div>

                  <p className="text-sm text-gray-500 mt-6">
                     If this problem persists, please contact support.
                  </p>
               </div>
            </div>
         );
      }

      return this.props.children;
   }
}
