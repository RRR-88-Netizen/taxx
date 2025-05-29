
import { SiteLogo } from "./site-logo";
import { MainNav } from "./main-nav";
import { UserNav } from "../user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-header text-header-foreground backdrop-blur supports-[backdrop-filter]:bg-header/90">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <SiteLogo />
        <div className="flex items-center space-x-4">
          <MainNav />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
