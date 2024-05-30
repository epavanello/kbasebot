import { cn } from "@/lib/utils";

export default function InputNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <small
      className={cn(
        "text-[10px] whitespace-nowrap text-gray-700 dark:text-gray-200 leading-none absolute right-1 bottom-1 bg-white/90 dark:bg-black/80 rounded-lg",
        className,
      )}
    >
      {children}
    </small>
  );
}
