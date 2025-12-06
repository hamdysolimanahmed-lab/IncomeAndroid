import { Moon, Sun, Wallet } from "lucide-react";
import { Button } from "./ui/Button";

export function Header({ darkMode, setDarkMode }) {
    return (
        <header className="sticky top-0 z-30 w-full glass-dark border-b border-slate-200 dark:border-white/10 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg animate-glow">
                        <Wallet className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold gradient-text font-arabic">
                            إدارة المعاملات المالية
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-arabic">نظام متقدم لإدارة الدخل والمصروفات</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDarkMode(!darkMode)}
                        aria-label="تبديل الوضع الداكن"
                        className="relative group hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
                        {darkMode ? (
                            <Sun className="w-5 h-5 text-amber-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-indigo-400" />
                        )}
                    </Button>
                </div>
            </div>
        </header>
    );
}
