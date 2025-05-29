
import { AuthForm } from "@/components/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">歡迎回來！</CardTitle>
          <CardDescription>登入以存取您的「牛馬學習」帳戶。</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            還沒有帳戶嗎？{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              在此註冊
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

