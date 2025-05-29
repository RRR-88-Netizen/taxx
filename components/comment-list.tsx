
"use client";

import { useEffect, useState } from "react";
import { db as firebaseDbService, isFirebaseInitialized } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import type { Comment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { MessageSquare, UserCircle, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CardDescription } from "@/components/ui/card";

function CommentItem({ comment }: { comment: Comment }) {
  const date = comment.createdAt instanceof Timestamp ? comment.createdAt.toDate() : new Date(comment.createdAt as any);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: zhTW }); 

  return (
    <Card className="mb-4 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-start space-x-4 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage 
            src={comment.userAvatar || `https://placehold.co/40x40.png?text=${comment.userName?.[0]?.toUpperCase() || 'A'}`} 
            alt={comment.userName} 
            data-ai-hint="使用者 頭像"
          />
          <AvatarFallback><UserCircle className="h-6 w-6" /></AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base font-semibold">{comment.userName}</CardTitle>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-foreground whitespace-pre-wrap">{comment.text}</p>
      </CardContent>
    </Card>
  );
}

export function CommentList() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseInitialized || !firebaseDbService) {
      setError("資料庫服務未設定。無法載入留言。");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const q = query(collection(firebaseDbService, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(fetchedComments);
      setIsLoading(false);
      setError(null);
    }, (err) => {
      console.error("擷取留言時發生錯誤：", err);
      setError("無法載入留言。請稍後再試。");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="mb-4">
            <CardHeader className="flex flex-row items-center space-x-4 p-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
       <Card className="border-destructive/50 bg-destructive/10 p-4 mt-4">
        <CardContent className="flex flex-col items-center text-center text-destructive-foreground p-0">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <p className="font-semibold">載入留言時發生錯誤</p>
          <CardDescription className="text-destructive-foreground/80 mt-1 text-sm">
            {error}
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">目前沒有留言。成為第一個分享您想法的人！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

