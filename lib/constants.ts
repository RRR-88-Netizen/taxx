
import type { LucideIcon } from "lucide-react";
import { Home, FileText, Calculator, BookOpen, MessageCircle, LogIn, UserPlus, Workflow, History } from "lucide-react"; // Changed HelpCircle to Workflow

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  authRequired?: boolean;
  hideWhenAuthed?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "首頁", href: "/", icon: Home },
  { label: "申請指南", href: "/application-guide", icon: FileText },
  { label: "AI 稅務助理", href: "/tax-assistant", icon: Calculator },
  { label: "申請流程圖", href: "/application-flowchart", icon: Workflow }, 
  { label: "學習系統", href: "/learning-system", icon: BookOpen, authRequired: true },
  { label: "留言區", href: "/comments", icon: MessageCircle, authRequired: true },
];

export const AUTH_NAV_ITEMS: NavItem[] = [
  { label: "登入", href: "/login", icon: LogIn, hideWhenAuthed: true },
  { label: "註冊", href: "/register", icon: UserPlus, hideWhenAuthed: true },
];
