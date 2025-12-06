import { TrendingUp, DollarSign } from "lucide-react";

export function Summary({ totalRows, totalAmount }) {
    return (
        <div className="row g-4 mb-5 animate-slide-up">
            {/* Total Transactions Card */}
            <div className="col-12 col-md-6">
                <div className="premium-card glass-dark p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-arabic mb-2">إجمالي المعاملات</p>

                            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mt-2">{totalRows}</h3>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                            <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full opacity-60" />
                </div>
            </div>

            {/* Total Amount Card */}
            <div className="col-12 col-md-6">
                <div className="premium-card glass-dark p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-arabic mb-2">إجمالي المبلغ</p>

                            <h3 className="text-4xl font-bold gradient-text-accent mt-2">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}
                            </h3>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg">
                            <DollarSign className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 h-1 w-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full opacity-60" />
                </div>
            </div>
        </div>
    );
}
