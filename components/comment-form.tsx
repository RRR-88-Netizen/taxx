
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-provider";
import { db as firebaseDbService, isFirebaseInitialized } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  text: z.string().min(5, { message: "留言必須至少 5 個字元。" }).max(500, { message: "留言不能超過 500 個字元。" }),
});

interface CommentFormProps {
  onCommentAdded: () => void; // 回呼以刷新留言列表
}

export function CommentForm({ onCommentAdded }: CommentFormProps) {
  const { user, isFirebaseEnabled } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isFirebaseInitialized || !firebaseDbService) {
      toast({ title: "服務不可用", description: "資料庫服務未設定。", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "需要驗證", description: "您必須登入才能留言。", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(collection(firebaseDbService, "comments"), {
        text: values.text,
        userId: user.uid,
        userName: user.displayName || user.email || "匿名使用者",
        userAvatar: user.photoURL,
        createdAt: serverTimestamp(),
      });
      toast({ title: "成功", description: "留言成功發布！" });
      form.reset();
      onCommentAdded(); // 觸發刷新
    } catch (error) {
      console.error("發布留言時發生錯誤：", error);
      toast({ title: "錯誤", description: "無法發布留言。", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isFirebaseInitialized || !isFirebaseEnabled) {
     return (
      <Card className="border-warning-foreground/50 bg-warning/10 p-4 mt-4">
        <CardContent className="flex flex-col items-center text-center text-warning-foreground p-0">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <p className="font-semibold">留言功能不可用</p>
          <CardDescription className="text-warning-foreground/80 mt-1 text-sm">
            留言功能需要設定 Firebase。
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return <p className="text-muted-foreground">請登入以發表留言。</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">發表留言</FormLabel>
              <FormControl>
                <Textarea placeholder="分享您的想法..." {...field} className="min-h-[100px] resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          發布留言
        </Button>
      </form>
    </Form>
  );
}

