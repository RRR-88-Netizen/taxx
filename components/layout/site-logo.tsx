
import Link from "next/link";
import { Brain } from "lucide-react";

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Brain className="h-8 w-8 text-header-foreground" />
      <span className="text-2xl font-bold text-header-foreground">
        牛馬學習
      </span>
    </Link>
  );
}
