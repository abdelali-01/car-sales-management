import { Order } from "@/types/auto-sales";
import { ShoppingBagIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface ClientOrdersListProps {
    orders: Order[] | null;
    loading: boolean;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    canceled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function ClientOrdersList({ orders, loading }: ClientOrdersListProps) {
    if (loading) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-6 shadow-sm h-64 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ShoppingBagIcon className="w-6 h-6 text-brand-500" />
                Client Orders
                <span className="ml-auto text-xs font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {orders?.length || 0} Orders
                </span>
            </h3>

            {!orders || orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
                    <ShoppingBagIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No orders found for this client.</p>
                </div>
            ) : (
                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="group flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200"
                        >

                            {/* Order Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 dark:text-white truncate">
                                            {order.offer
                                                ? `${order.offer.brand} ${order.offer.model}`
                                                : order.orderedCar
                                                    ? `${order.orderedCar.brand} ${order.orderedCar.model}`
                                                    : `Order #${order.id}`}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {order.offer
                                                ? `${order.offer.year} • ${order.offer.km?.toLocaleString()} km`
                                                : order.orderedCar
                                                    ? `${order.orderedCar.year} • ${order.orderedCar.color || 'Custom'}`
                                                    : 'Custom Request'}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Order Date</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Agreed Price</span>
                                        <span className="font-bold text-brand-600 dark:text-brand-400">
                                            {Number(order.agreedPrice ?? order.offer?.price ?? 0).toLocaleString()} M
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
