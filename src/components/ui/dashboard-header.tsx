import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({
  heading,
  text,
  className,
  children,
}: DashboardHeaderProps) {
  return (
    <div className={cn("flex justify-between px-2", className || "")}>
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-wide">{heading}</h1>
        {text && <p className="text-neutral-400">{text}</p>}
      </div>
      {children}
    </div>
  );
}
