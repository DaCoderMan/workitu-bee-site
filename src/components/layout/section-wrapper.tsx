import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("mx-auto max-w-6xl px-4 py-20 md:py-28", className)}
    >
      {children}
    </section>
  );
}
