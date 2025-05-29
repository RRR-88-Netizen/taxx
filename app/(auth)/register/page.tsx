
import { AuthForm } from "@/components/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">建立帳戶</CardTitle>
          <CardDescription>加入「牛馬學習」開始您的學習之旅。</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="register" />
           <p className="mt-6 text-center text-sm text-muted-foreground">
            已經有帳戶了？{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              在此登入
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

