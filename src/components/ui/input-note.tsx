import { cn } from "@/lib/utils";

export default function InputNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <small
      className={cn(
        "absolute bottom-1 right-1 whitespace-nowrap rounded-lg bg-white/90 text-[10px] leading-none text-gray-700 dark:bg-black/80 dark:text-gray-200",
        className,
      )}
    >
      {children}
    </small>
  );
}
