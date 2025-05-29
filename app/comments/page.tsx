
"use client"; 

import { CommentForm } from "@/components/comment-form";
import { CommentList } from "@/components/comment-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from "lucide-react";
import { useState, useCallback } from "react";

export default function CommentsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleCommentAdded = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-3xl font-bold">討論區</CardTitle>
          <CardDescription>分享您的想法、提出問題並與社群互動。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CommentForm onCommentAdded={handleCommentAdded} />
          <Separator className="my-8" />
          <div>
            <h2 className="text-2xl font-semibold mb-6">最近留言</h2>
            <CommentList key={refreshKey} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

