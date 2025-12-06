import { Calendar, User, FileText, DollarSign, Hash, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function TransactionDetails({ transaction }) {
    if (!transaction) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            return format(date, 'dd MMMM yyyy', { locale: ar });
        } catch {
            return dateStr;
        }
    };

    const DetailRow = ({ icon: Icon, label, value, className = '' }) => (
        <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200">
            <div className="flex-shrink-0 p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {label}
                </div>
                <div className={`text-base font-semibold text-slate-900 dark:text-white break-words ${className}`} dir="auto">
                    {value || 'N/A'}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-2">
            {/* Amount - Highlighted */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <div className="text-sm font-medium opacity-90 mb-2 font-arabic">مبلغ المعاملة</div>
                <div className="text-4xl font-bold">
                    {transaction.amount || '$0.00'}
                </div>
                {transaction.amount_value && (
                    <div className="text-sm opacity-75 mt-1">
                        القيمة: {transaction.amount_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </div>
                )}
            </div>

            {/* Other Details */}
            <div className="grid gap-2">
                <DetailRow
                    icon={Calendar}
                    label="تاريخ المعاملة"
                    value={formatDate(transaction.transaction_date_iso || transaction.transaction_date)}
                />

                <DetailRow
                    icon={User}
                    label="الدافع"
                    value={transaction.payer}
                />

                <DetailRow
                    icon={FileText}
                    label="الوصف"
                    value={transaction.description}
                />

                <div className="grid grid-cols-2 gap-2">
                    <DetailRow
                        icon={Hash}
                        label="الشهر"
                        value={transaction.mo ? `شهر ${transaction.mo}` : 'غير متوفر'}
                    />

                    <DetailRow
                        icon={Hash}
                        label="السنة"
                        value={transaction.yr}
                    />
                </div>
            </div>


        </div>
    );
}
