"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiBell, FiCheck, FiLoader, FiTrash2, FiBook, FiAward,
    FiVideo, FiPackage, FiCreditCard, FiAlertCircle, FiCheckCircle
} from "react-icons/fi";

// Mock notifications
const mockNotifications = [
    {
        _id: "1",
        type: "course",
        title: "New lesson available!",
        message: "A new lesson 'Advanced Typography' has been added to your enrolled course.",
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        icon: FiBook
    },
    {
        _id: "2",
        type: "live",
        title: "Live class starting soon",
        message: "Your live class 'UI/UX Design Principles' starts in 1 hour. Don't miss it!",
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: FiVideo
    },
    {
        _id: "3",
        type: "certificate",
        title: "Certificate Ready!",
        message: "Congratulations! Your certificate for 'Complete UI/UX Course' is ready to download.",
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        icon: FiAward
    },
    {
        _id: "4",
        type: "order",
        title: "Order Confirmed",
        message: "Your order #ORD-2024-001234 has been confirmed and is being processed.",
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        icon: FiPackage
    },
    {
        _id: "5",
        type: "payment",
        title: "Payment Successful",
        message: "Your payment of ৳4,999 for 'Complete UI/UX Course' was successful.",
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        icon: FiCreditCard
    },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        setTimeout(() => {
            setNotifications(mockNotifications);
            setLoading(false);
        }, 500);
    }, []);

    const getTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "course": return "bg-blue-100 text-blue-500";
            case "live": return "bg-red-100 text-red-500";
            case "certificate": return "bg-yellow-100 text-yellow-600";
            case "order": return "bg-emerald-100 text-emerald-500";
            case "payment": return "bg-teal-100 text-teal-500";
            default: return "bg-gray-100 text-gray-500";
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n._id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n._id !== id));
    };

    const filteredNotifications = notifications.filter(n =>
        filter === "all" ? true : filter === "unread" ? !n.read : n.read
    );

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
                    <p className="text-gray-500">Stay updated with your activities</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                        <FiCheckCircle size={16} />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <FiBell className="text-cyan-500 mb-3" size={24} />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</p>
                    <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <FiAlertCircle className="text-red-500 mb-3" size={24} />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{unreadCount}</p>
                    <p className="text-sm text-gray-500">Unread</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {["all", "unread", "read"].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all capitalize ${filter === status
                                ? "bg-cyan-500 text-white shadow-lg"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {status}
                        {status === "unread" && unreadCount > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <FiLoader className="animate-spin text-primary" size={32} />
                </div>
            ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <FiBell className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        No notifications
                    </h3>
                    <p className="text-gray-500">You're all caught up!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification, index) => (
                        <motion.div
                            key={notification._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-white dark:bg-gray-800 rounded-2xl border transition-all ${!notification.read
                                    ? "border-cyan-200 dark:border-cyan-700 shadow-sm"
                                    : "border-gray-100 dark:border-gray-700"
                                }`}
                        >
                            <div className="flex items-start gap-4 p-5">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                                    <notification.icon size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className={`font-bold mb-1 ${!notification.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                                                {notification.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-2">{notification.message}</p>
                                            <span className="text-xs text-gray-400">{getTimeAgo(notification.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-cyan-500"
                                                    title="Mark as read"
                                                >
                                                    <FiCheck size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification._id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0 mt-2" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
