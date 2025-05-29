
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { auth as firebaseAuthService, isFirebaseInitialized } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({ message: "無效的電子郵件地址。" }),
  password: z.string().min(6, { message: "密碼必須至少為 6 個字元。" }),
  username: z.string().optional(), // 僅用於註冊
});

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isFirebaseInitialized || !firebaseAuthService) {
      toast({
        title: "服務不可用",
        description: "驗證服務未設定。請聯絡支援人員。",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let userCredential: UserCredential;
      if (mode === "register") {
        if (!values.username) {
            toast({ title: "錯誤", description: "註冊需要使用者名稱。", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        userCredential = await createUserWithEmailAndPassword(firebaseAuthService, values.email, values.password);
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: values.username });
        }
        toast({ title: "成功", description: "註冊成功！正在重定向..." });
      } else {
        userCredential = await signInWithEmailAndPassword(firebaseAuthService, values.email, values.password);
        toast({ title: "成功", description: "登入成功！正在重定向..." });
      }
      router.push("/"); // 重定向到首頁或儀表板
    } catch (error: any) {
      toast({
        title: "驗證錯誤",
        description: error.message || "發生意外錯誤。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isFirebaseInitialized) {
    return (
      <Card className="border-destructive bg-destructive/10 p-4">
        <CardContent className="flex flex-col items-center text-center text-destructive-foreground p-0">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <p className="font-semibold">驗證服務不可用</p>
          <CardDescription className="text-destructive-foreground/80 mt-1">
            Firebase 未正確設定。請檢查瀏覽器控制台以獲取更多詳細資訊或聯絡支援人員。
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {mode === "register" && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>使用者名稱</FormLabel>
                <FormControl>
                  <Input placeholder="選擇一個使用者名稱" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>電子郵件</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密碼</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "register" ? "註冊" : "登入"}
        </Button>
      </form>
    </Form>
  );
}

