"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const router = useRouter();

  function toggleLocale() {
    const current = document.cookie
      .split("; ")
      .find((c) => c.startsWith("locale="))
      ?.split("=")[1] || "en";

    const next = current === "en" ? "he" : "en";
    document.cookie = `locale=${next};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLocale}
      aria-label="Switch language"
    >
      <Languages className="h-4 w-4" />
    </Button>
  );
}
