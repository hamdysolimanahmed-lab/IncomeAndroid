import { Search, X, Calendar } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export function Filters({ search, setSearch, month, setMonth, year, setYear, onClear }) {
    return (
        <div className="glass-dark p-4 rounded-2xl border border-slate-200 dark:border-white/10 mb-4">
            <div className="row g-3">
                {/* Search Input */}
                <div className="col-12 col-md-6 position-relative">
                    <Search className="absolute right-3 top-3 h-5 w-5 text-indigo-400" />
                    <Input
                        placeholder="ابحث عن الدافع، الوصف، المبلغ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pr-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 font-arabic focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                </div>

                {/* Date Filters */}
                <div className="col-12 col-md-6 d-flex flex-wrap gap-2 align-items-center">
                    <div className="relative">
                        <Calendar className="absolute right-2 top-3 h-4 w-4 text-purple-400" />
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-32 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-3 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-arabic appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-white dark:bg-slate-900 text-slate-400">الشهر</option>
                            <option value="1" className="bg-white dark:bg-slate-900">يناير</option>
                            <option value="2" className="bg-white dark:bg-slate-900">فبراير</option>
                            <option value="3" className="bg-white dark:bg-slate-900">مارس</option>
                            <option value="4" className="bg-white dark:bg-slate-900">أبريل</option>
                            <option value="5" className="bg-white dark:bg-slate-900">مايو</option>
                            <option value="6" className="bg-white dark:bg-slate-900">يونيو</option>
                            <option value="7" className="bg-white dark:bg-slate-900">يوليو</option>
                            <option value="8" className="bg-white dark:bg-slate-900">أغسطس</option>
                            <option value="9" className="bg-white dark:bg-slate-900">سبتمبر</option>
                            <option value="10" className="bg-white dark:bg-slate-900">أكتوبر</option>
                            <option value="11" className="bg-white dark:bg-slate-900">نوفمبر</option>
                            <option value="12" className="bg-white dark:bg-slate-900">ديسمبر</option>
                        </select>
                    </div>
                    <Input
                        placeholder="السنة (YYYY)"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-32 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 font-arabic focus:border-purple-500 focus:ring-purple-500/20"
                    />
                    <Button
                        variant="secondary"
                        onClick={onClear}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 gap-2 font-arabic"
                    >
                        <X className="w-4 h-4" />
                        مسح
                    </Button>
                </div>
            </div>
        </div>
    );
}
