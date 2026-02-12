"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiCreditCard, FiDollarSign, FiCalendar, FiLoader,
    FiCheckCircle, FiClock, FiXCircle, FiDownload, FiEye
} from "react-icons/fi";

// Mock payments
const mockPayments = [
    {
        _id: "1",
        orderId: "ORD-2024-001234",
        amount: 4999,
        method: "bKash",
        status: "completed",
        createdAt: new Date("2024-01-20"),
        items: [{ title: "Complete UI/UX Design Masterclass", type: "course" }]
    },
    {
        _id: "2",
        orderId: "ORD-2024-001198",
        amount: 1500,
        method: "Card",
        status: "completed",
        createdAt: new Date("2024-01-15"),
        items: [{ title: "Professional Logo Bundle", type: "graphics" }]
    },
    {
        _id: "3",
        orderId: "ORD-2024-001087",
        amount: 2999,
        method: "bKash",
        status: "pending",
        createdAt: new Date("2024-01-25"),
        items: [{ title: "Graphic Design Fundamentals", type: "course" }]
    },
    {
        _id: "4",
        orderId: "ORD-2024-000956",
        amount: 799,
        method: "Card",
        status: "failed",
        createdAt: new Date("2024-01-12"),
        items: [{ title: "Social Media Templates Pack", type: "graphics" }]
    },
];

export default function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        setTimeout(() => {
            setPayments(mockPayments);
            setLoading(false);
        }, 500);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "completed": return "bg-emerald-100 text-emerald-600";
            case "pending": return "bg-yellow-100 text-yellow-600";
            case "failed": return "bg-red-100 text-red-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed": return <FiCheckCircle />;
            case "pending": return <FiClock />;
            case "failed": return <FiXCircle />;
            default: return <FiClock />;
        }
    };

    const filteredPayments = payments.filter(p =>
        filter === "all" ? true : p.status === filter
    );

    const totalSpent = payments
        .filter(p => p.status === "completed")
        .reduce((acc, p) => acc + p.amount, 0);

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment History</h1>
                <p className="text-gray-500">View all your transactions and invoices</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                    <FiDollarSign size={28} className="mb-3" />
                    <p className="text-2xl font-bold">৳{totalSpent.toLocaleString()}</p>
                    <p className="text-emerald-100">Total Spent</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <FiCheckCircle size={28} className="text-emerald-500 mb-3" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {payments.filter(p => p.status === "completed").length}
                    </p>
                    <p className="text-gray-500">Completed</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <FiClock size={28} className="text-yellow-500 mb-3" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {payments.filter(p => p.status === "pending").length}
                    </p>
                    <p className="text-gray-500">Pending</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <FiCreditCard size={28} className="text-blue-500 mb-3" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{payments.length}</p>
                    <p className="text-gray-500">Total Transactions</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {["all", "completed", "pending", "failed"].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all capitalize whitespace-nowrap ${filter === status
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Payments Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <FiLoader className="animate-spin text-primary" size={32} />
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <FiCreditCard className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        No payments found
                    </h3>
                    <p className="text-gray-500">Your payment history will appear here</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Order ID</th>
                                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Item</th>
                                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Method</th>
                                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((payment, index) => (
                                    <motion.tr
                                        key={payment._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                    >
                                        <td className="p-4">
                                            <span className="font-mono text-sm text-gray-900 dark:text-white">
                                                {payment.orderId}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {payment.items[0]?.title}
                                                </p>
                                                <span className="text-xs text-gray-400 capitalize">
                                                    {payment.items[0]?.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <FiCalendar size={14} />
                                                {payment.createdAt.toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {payment.method}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                ৳{payment.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                                    <FiEye size={16} className="text-gray-500" />
                                                </button>
                                                {payment.status === "completed" && (
                                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                                        <FiDownload size={16} className="text-gray-500" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
