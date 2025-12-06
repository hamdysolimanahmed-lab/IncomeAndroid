import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
    return (
        <div className={cn("bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden", className)} {...props}>
            {children}
        </div>
    );
}
