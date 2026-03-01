"use client";

import { usePathname, useRouter } from "next/navigation";
import { FolderOpen, Receipt, MessageCircle, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Projects", href: "/dashboard", icon: FolderOpen },
  { label: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { label: "Chat", href: "/dashboard#chat", icon: MessageCircle },
  { label: "Book a Call", href: "/book", icon: Calendar },
];

export function DashboardNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <div className="sticky top-24 flex flex-col gap-1">
        <p className="mb-4 truncate text-sm text-muted-foreground">{email}</p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => router.push(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
        <Button
          variant="ghost"
          className="mt-4 justify-start text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
