import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
  wrapperClass?: string;
}

export function DashboardHeader({ heading, text, className, children, wrapperClass }: DashboardHeaderProps) {
  return (
    <div className={cn("flex flex-row flex-wrap justify-center items-center py-8 gap-6", className || "")}>
      <div className={cn("grid gap-1", wrapperClass || "")}>
        <h1 className="text-2xl font-bold tracking-wide">{heading}</h1>
        {text && <p className="text-neutral-400">{text}</p>}
      </div>
      {children}
    </div>
  );
}
