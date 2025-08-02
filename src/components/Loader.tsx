// src/components/LoadingPage.tsx
"use client";

import { Layout } from "@/components/Layout";
import { Loader2 } from "lucide-react";

export function LoadingPage() {
  return (
    <Layout>
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    </Layout>
  );
}
