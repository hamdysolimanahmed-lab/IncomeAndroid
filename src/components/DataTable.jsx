import { ArrowUpDown, FileText, Eye } from "lucide-react";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { cn } from "../lib/utils";

export function DataTable({ data, sortConfig, onSort, isLoading, onRowClick, selectedTransaction }) {
    if (isLoading) {
        return <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 glass-dark rounded-2xl shimmer border border-white/10" />
            ))}
        </div>;
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-16 glass-dark rounded-2xl border border-slate-200 dark:border-white/10">
                <p className="text-slate-500 dark:text-slate-400 font-arabic text-lg">لا توجد معاملات</p>

            </div>
        );
    }

    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl glass-dark border border-slate-200 dark:border-white/10 shadow-2xl">
                <table className="w-full text-sm">
                    <thead className="text-xs uppercase bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-900/80 dark:to-indigo-900/80 backdrop-blur">
                        <tr>
                            <SortableHeader label="التاريخ" sortKey="transaction_date_iso" currentSort={sortConfig} onSort={onSort} />
                            <SortableHeader label="الدافع" sortKey="payer" currentSort={sortConfig} onSort={onSort} />
                            <SortableHeader label="الوصف" sortKey="description" currentSort={sortConfig} onSort={onSort} />
                            <SortableHeader label="المبلغ" sortKey="amount_value" currentSort={sortConfig} onSort={onSort} align="right" />

                            <th className="px-6 py-4 text-center text-white font-arabic">تفاصيل</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/10 bg-transparent dark:bg-slate-800/30 backdrop-blur">
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                className={cn(
                                    "transition-all duration-300 group cursor-pointer border-b border-slate-200 dark:border-white/5",
                                    selectedTransaction && selectedTransaction.transaction_date_iso === row.transaction_date_iso && selectedTransaction.payer === row.payer
                                        ? "bg-purple-100 dark:bg-purple-400/30 border-l-4 border-l-purple-300 dark:border-l-purple-400"
                                        : "hover:bg-slate-50 dark:hover:bg-gradient-to-r dark:hover:from-indigo-500/10 dark:hover:to-purple-500/10"
                                )}
                            >
                                <td className="px-6 py-3 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                                    {row.transaction_date_iso ? format(new Date(row.transaction_date_iso), 'dd MMM yyyy', { locale: ar }) : row.transaction_date_raw}
                                </td>
                                <td className="px-6 py-3 font-arabic font-bold text-slate-700 dark:text-white" dir="auto">
                                    {row.payer}
                                </td>
                                <td className="px-6 py-3 max-w-xs truncate font-arabic text-slate-500 dark:text-white" dir="auto" title={row.description}>
                                    {row.description}
                                </td>
                                <td className="px-6 py-3 text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                    {row.amount}
                                </td>

                                <td className="px-6 py-3 text-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRowClick(row)}
                                        className="text-purple-400 hover:bg-purple-500/20 group-hover:scale-125 transition-all duration-300"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {data.map((row, index) => (
                    <div
                        key={index}
                        className={cn(
                            "premium-card glass-dark p-5 rounded-2xl border space-y-3 cursor-pointer",
                            selectedTransaction && selectedTransaction.transaction_date_iso === row.transaction_date_iso && selectedTransaction.payer === row.payer
                                ? "border-purple-300 dark:border-purple-400 bg-purple-50 dark:bg-purple-400/30 shadow-lg shadow-purple-400/40"
                                : "border-slate-200 dark:border-white/10"
                        )}
                        onClick={() => onRowClick(row)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs text-slate-500">
                                    {row.transaction_date_iso ? format(new Date(row.transaction_date_iso), 'dd MMM yyyy', { locale: ar }) : row.transaction_date_raw}
                                </div>
                                <div className="font-bold text-slate-900 dark:text-white mt-1 font-arabic text-lg" dir="auto">{row.payer}</div>
                            </div>
                            <div className="text-xl font-bold gradient-text-accent">{row.amount}</div>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-arabic border-t border-slate-200 dark:border-white/10 pt-3" dir="auto">
                            {row.description}
                        </div>
                        <div className="flex justify-between items-center pt-2 gap-2">

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRowClick(row);
                                }}
                                className="text-purple-400 hover:bg-purple-500/20 gap-2 font-arabic"
                            >
                                <Eye className="w-4 h-4" />
                                تفاصيل
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

function SortableHeader({ label, sortKey, currentSort, onSort, align = "left" }) {
    return (
        <th
            className={cn("px-6 py-4 cursor-pointer hover:bg-white/10 transition-all select-none font-arabic", align === "right" ? "text-right" : "text-right")}
            onClick={() => onSort(sortKey)}
        >
            <div className={cn("flex items-center gap-2 text-white", align === "right" && "justify-end")}>
                {label}
                <ArrowUpDown className={cn("w-4 h-4 transition-colors", currentSort.key === sortKey ? "text-yellow-300" : "text-white/70")} />
            </div>
        </th>
    );
}
