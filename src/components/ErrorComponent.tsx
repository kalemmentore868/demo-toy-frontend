// src/components/ErrorPage.tsx
"use client";

import { Layout } from "@/components/Layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorPage({
  message = "Something went wrong.",
  onRetry,
}: ErrorPageProps) {
  return (
    <Layout>
      <div className="flex h-full w-full items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
          {onRetry && (
            <div className="mt-4 flex justify-end">
              <Button onClick={onRetry}>Retry</Button>
            </div>
          )}
        </Alert>
      </div>
    </Layout>
  );
}
