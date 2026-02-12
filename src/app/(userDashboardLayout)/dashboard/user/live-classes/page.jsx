"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FiVideo, FiCalendar, FiClock, FiUsers, FiExternalLink,
    FiLoader, FiPlay, FiCheckCircle
} from "react-icons/fi";
import { liveClassService } from "@/services/api";
import { toast } from "react-hot-toast";

export default function LiveClassesPage() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("upcoming"); // upcoming, completed

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await liveClassService.getMyUpcoming();
            setClasses(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load live classes");
        } finally {
            setLoading(false);
        }
    };

    const getTimeUntil = (date) => {
        const now = new Date();
        const diff = new Date(date) - now;
        if (diff < 0) return "Started";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 24) return `${Math.floor(hours / 24)} days`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes} minutes`;
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isLive = (liveClass) => {
        const now = new Date();
        const start = new Date(liveClass.scheduledAt);
        const end = liveClass.endTime ? new Date(liveClass.endTime) : new Date(start.getTime() + liveClass.duration * 60000);
        return now >= start && now <= end && liveClass.status === "live";
    };

    const filteredClasses = classes.filter(c => {
        if (filter === "upcoming") {
            // Show scheduled and currently live classes
            return c.status === "scheduled" || c.status === "live";
        }
        return c.status === "completed";
    });

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Live Classes</h1>
                <p className="text-gray-500">Join live sessions and watch recordings</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter("upcoming")}
                    className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${filter === "upcoming"
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    <FiVideo className="inline mr-2" size={16} />
                    Upcoming
                </button>
                <button
                    onClick={() => setFilter("completed")}
                    className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${filter === "completed"
                        ? "bg-gray-800 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    <FiCheckCircle className="inline mr-2" size={16} />
                    Completed
                </button>
            </div>

            {/* Classes List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <FiLoader className="animate-spin text-primary" size={32} />
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <FiVideo className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        No {filter} classes
                    </h3>
                    <p className="text-gray-500">
                        {filter === "upcoming"
                            ? "Check back later for new live sessions"
                            : "You haven't attended any classes yet"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredClasses.map((liveClass, index) => (
                        <motion.div
                            key={liveClass._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 p-6">
                                {/* Status Badge */}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${liveClass.status === "scheduled" || liveClass.status === "live"
                                    ? "bg-red-100 dark:bg-red-900/30"
                                    : "bg-gray-100 dark:bg-gray-700"
                                    }`}>
                                    {liveClass.status === "scheduled" || liveClass.status === "live" ? (
                                        <FiVideo className="text-red-500" size={28} />
                                    ) : (
                                        <FiPlay className="text-gray-500" size={28} />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${liveClass.status === "scheduled" || liveClass.status === "live"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {isLive(liveClass) ? "LIVE NOW" : liveClass.status === "scheduled" ? "UPCOMING" : "RECORDING"}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {liveClass.meetingType === "zoom" ? "Zoom" : "Google Meet"}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                                        {liveClass.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-3">
                                        {liveClass.course?.title} • {liveClass.instructor?.firstName} {liveClass.instructor?.lastName}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <FiCalendar size={14} />
                                            {formatDateTime(liveClass.scheduledAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiClock size={14} />
                                            {liveClass.duration} min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiUsers size={14} />
                                            {liveClass.status === "scheduled" || liveClass.status === "live"
                                                ? `${liveClass.currentAttendees || 0} joined`
                                                : `${liveClass.totalAttendees || 0} attended`}
                                        </span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex-shrink-0">
                                    {liveClass.status === "scheduled" || liveClass.status === "live" ? (
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                                                {isLive(liveClass) ? "Happening Now" : `Starts in ${getTimeUntil(liveClass.scheduledAt)}`}
                                            </p>

                                            {liveClass.meetingType === "zoom" ? (
                                                <Link
                                                    href={`/live-class/${liveClass._id}`}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
                                                >
                                                    <FiVideo size={18} />
                                                    Join Class
                                                </Link>
                                            ) : (
                                                <a
                                                    href={liveClass.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
                                                >
                                                    <FiVideo size={18} />
                                                    Join Meeting
                                                    <FiExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        liveClass.recordingUrl ? (
                                            <a
                                                href={liveClass.recordingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white font-bold rounded-xl transition-colors"
                                            >
                                                <FiPlay size={18} />
                                                Watch Recording
                                            </a>
                                        ) : (
                                            <span className="text-gray-500 text-sm italic">Recording unavailable</span>
                                        )

                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
