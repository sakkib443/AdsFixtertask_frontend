"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiUser, FiLayout, FiDatabase, FiLoader, FiArrowRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/authSlice";
import { statsService, flowService, spreadsheetService } from "@/services/api";

export default function UserDashboard() {
    const currentUser = useSelector(selectCurrentUser);
    const [stats, setStats] = useState(null);
    const [recentFlows, setRecentFlows] = useState([]);
    const [recentSheets, setRecentSheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, flowsRes, sheetsRes] = await Promise.all([
                    statsService.getUserStats(),
                    flowService.getAll(),
                    spreadsheetService.getAll()
                ]);

                if (statsRes.success) setStats(statsRes.data);
                if (flowsRes.success) setRecentFlows(flowsRes.data?.slice(0, 3) || []);
                if (sheetsRes.success) setRecentSheets(sheetsRes.data?.slice(0, 3) || []);

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const quickLinks = [
        { name: "My Flows", href: "/dashboard/admin/flows", icon: FiLayout, color: "from-indigo-500 to-blue-500", count: stats?.totalFlows || 0 },
        { name: "Spreadsheets", href: "/dashboard/admin/spreadsheet", icon: FiDatabase, color: "from-emerald-500 to-teal-500", count: stats?.totalSheets || 0 },
        { name: "Profile Settings", href: "/dashboard/user/profile", icon: FiUser, color: "from-gray-700 to-gray-900", count: null },
    ];

    if (!mounted || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <FiLoader className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen font-sans">
            {/* Professional Profile Header */}
            <div className="relative group">
                <div className="h-48 md:h-64 rounded-3xl overflow-hidden relative shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2070"
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                <div className="absolute -bottom-6 left-6 right-6 flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-24 h-12 md:w-32 md:h-32 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white">
                            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black">
                                {currentUser?.firstName?.[0] || "U"}
                            </div>
                        </div>
                        <div className="mb-2 md:mb-0">
                            <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-md uppercase tracking-tighter">
                                {currentUser?.firstName} {currentUser?.lastName}
                            </h1>
                            <div className="flex items-center gap-2 text-white/90 text-[10px] font-black uppercase tracking-widest">
                                <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                                    {currentUser?.role || 'User'}
                                </span>
                                <span>•</span>
                                <span>Member since {new Date(currentUser?.createdAt || Date.now()).getFullYear()}</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/user/profile"
                        className="mb-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-gray-100"
                    >
                        <FiUser size={16} />
                        Edit Profile
                    </Link>
                </div>
            </div>

            <div className="pt-6" />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickLinks.map((link, i) => (
                    <motion.div key={link.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Link href={link.href} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 block group hover:shadow-md transition-all">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:rotate-6 transition-transform`}>
                                <link.icon size={24} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{link.name}</p>
                            <p className="text-3xl font-black text-gray-900 mt-1">{link.count}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Flows */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-black text-gray-900 uppercase tracking-tighter">Recent Flows</h3>
                        <Link href="/dashboard/admin/flows" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentFlows.length === 0 ? (
                            <div className="p-12 text-center text-gray-400 font-medium text-sm">No flows created yet.</div>
                        ) : recentFlows.map((flow) => (
                            <div key={flow._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FiLayout size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{flow.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{new Date(flow.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <Link href={`/builder?flowId=${flow._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                    <FiArrowRight size={20} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Spreadsheets */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-black text-gray-900 uppercase tracking-tighter">Recent Spreadsheets</h3>
                        <Link href="/dashboard/admin/spreadsheet" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentSheets.length === 0 ? (
                            <div className="p-12 text-center text-gray-400 font-medium text-sm">No sheets created yet.</div>
                        ) : recentSheets.map((sheet) => (
                            <div key={sheet._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <FiDatabase size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{sheet.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{new Date(sheet.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <Link href={`/dashboard/admin/spreadsheet/${sheet._id}`} className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                                    <FiArrowRight size={20} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
