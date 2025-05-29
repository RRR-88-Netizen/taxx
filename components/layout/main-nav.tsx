
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SiteLogo } from "./site-logo";

export function MainNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.authRequired) {
      return !!user;
    }
    return true;
  });

  const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", inSheet && "flex-col space-x-0 space-y-2 items-start w-full")}>
      {filteredNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors",
            pathname === item.href
              ? "text-header-foreground font-semibold"
              : "text-header-foreground/80 hover:text-header-foreground",
            inSheet && "text-lg w-full p-2 rounded-md",
            inSheet && pathname === item.href 
              ? "bg-white/10 text-header-foreground" 
              : inSheet ? "text-header-foreground/80 hover:bg-white/5 hover:text-header-foreground" : ""
          )}
        >
          <item.icon className={cn("mr-2 h-4 w-4 inline-block", inSheet && "h-5 w-5")} />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <div className="hidden md:flex">
        <NavLinks />
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-header-foreground hover:bg-white/10 hover:text-header-foreground focus-visible:ring-header-foreground">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6 bg-header text-header-foreground border-header-foreground/20">
            <div className="mb-6">
              <SiteLogo />
            </div>
            <NavLinks inSheet />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
