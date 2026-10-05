import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function SectionHeading({
  title,
  eyebrow,
  href,
  linkLabel = "ดูทั้งหมด",
}: {
  title: string;
  eyebrow?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
        >
          {linkLabel}
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="border-b bg-card">
      <div className="container-page py-8 sm:py-12">
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-prose text-muted-foreground">{description}</p>
        )}
      </div>
    </header>
  );
}
