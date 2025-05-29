
"use client";

import Link from "next/link";
import { LogOut, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-provider";
import { auth as firebaseAuthService } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { NAV_ITEMS, AUTH_NAV_ITEMS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function UserNav() {
  const { user, loading, isFirebaseEnabled } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    if (!isFirebaseEnabled || !firebaseAuthService) {
      toast({
        title: "登出失敗",
        description: "驗證服務不可用。",
        variant: "destructive",
      });
      return;
    }
    try {
      await signOut(firebaseAuthService);
      toast({ title: "已登出", description: "您已成功登出。" });
      router.push("/"); 
    } catch (error) {
      console.error("登出時發生錯誤： ", error);
      toast({ title: "登出錯誤", description: "無法登出。請再試一次。", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
      </div>
    );
  }

  if (!user || !isFirebaseEnabled) {
    // When on a page with a dark header, the default button variant might not look good.
    // Assuming the header is now dark (deep orange), let's ensure these buttons are visible.
    const buttonTextColorClass = "text-header-foreground hover:text-header-foreground/80";
    
    return (
      <div className="flex items-center space-x-2">
        {AUTH_NAV_ITEMS.filter(item => item.hideWhenAuthed).map(item => (
          <Button 
            key={item.label} 
            variant="ghost" 
            asChild 
            disabled={!isFirebaseEnabled && (item.label === "登入" || item.label === "註冊")}
            className={cn(buttonTextColorClass, "hover:bg-white/10")}
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
        {!isFirebaseEnabled && (
            <TooltipProvider>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <span className={cn("text-xs", buttonTextColorClass)}>(驗證 N/A)</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>由於設定問題，驗證功能不可用。</p>
                    </TooltipContent>
                 </Tooltip>
            </TooltipProvider>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full text-header-foreground hover:bg-white/10 focus-visible:ring-header-foreground">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={user.photoURL || `https://placehold.co/40x40.png?text=${user.email?.[0]?.toUpperCase() || 'U'}`} 
              alt={user.displayName || user.email || "使用者"} 
              data-ai-hint="個人資料 頭像"
            />
            <AvatarFallback className="bg-header-foreground/20 text-header-foreground">
              {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || <UserCircle className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || "使用者"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* 在此處新增任何使用者特定連結，例如：個人資料、設定 */}
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
