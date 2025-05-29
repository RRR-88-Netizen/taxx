
"use client"; 

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center shadow-xl bg-destructive/10 border-destructive">
        <CardHeader>
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
          <CardTitle className="text-3xl font-bold text-destructive-foreground">哎呀！出現了一些問題。</CardTitle>
          <CardDescription className="text-destructive-foreground/80 mt-2">
            我們遇到了一個意外的問題。請再試一次。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error?.message && (
            <p className="text-sm text-destructive-foreground/70 bg-destructive/20 p-3 rounded-md">
              錯誤詳情: {error.message}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => reset()}
            variant="destructive"
            size="lg"
          >
            再試一次
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

