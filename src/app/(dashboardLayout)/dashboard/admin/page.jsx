"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    FiMessageSquare,
    FiPlus,
    FiActivity,
    FiUsers,
    FiRefreshCw,
    FiArrowRight,
    FiLayout,
    FiCpu,
} from "react-icons/fi";

const StatsCard = ({ title, value, icon: Icon, gradient, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group p-6 rounded-3xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-600 transition-all duration-300 shadow-sm"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</h3>
                {subtitle && <p className="text-xs text-gray-400 mt-2 font-medium tracking-tight">{subtitle}</p>}
            </div>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={24} />
            </div>
        </div>
    </motion.div>
);

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalFlows: 12,
        activeFlows: 8,
        totalConvs: 450,
        messagesSent: 2840,
    });

    const [recentFlows, setRecentFlows] = useState([
        { _id: "1", name: "Customer Support Bot", status: "active", nodes: 15, lastEdited: "2 hours ago" },
        { _id: "2", name: "Lead Generation Flow", status: "active", nodes: 8, lastEdited: "5 hours ago" },
        { _id: "3", name: "Product FAQ Assistant", status: "inactive", nodes: 12, lastEdited: "1 day ago" },
    ]);

    useEffect(() => {
        // In a real app, fetch stats here
        setTimeout(() => setLoading(false), 800);
    }, []);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                        Dash<span className="text-blue-600">board</span>
                    </h1>
                    <p className="text-gray-400 font-medium mt-2 tracking-tight uppercase text-xs">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-600 transition-colors">
                        <FiRefreshCw size={20} />
                    </button>
                    <Link href="/builder">
                        <button className="px-8 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2">
                            <FiPlus size={16} /> New Flow
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Flows"
                    value={stats.totalFlows}
                    icon={FiLayout}
                    gradient="from-blue-600 to-indigo-600"
                    subtitle="Published & Drafts"
                />
                <StatsCard
                    title="Conversations"
                    value={stats.totalConvs}
                    icon={FiMessageSquare}
                    gradient="from-purple-600 to-pink-600"
                    subtitle="+24 today"
                />
                <StatsCard
                    title="Active Agents"
                    value={stats.activeFlows}
                    icon={FiCpu}
                    gradient="from-emerald-600 to-teal-600"
                    subtitle="Live on website"
                />
                <StatsCard
                    title="Activity"
                    value="98.4%"
                    icon={FiActivity}
                    gradient="from-amber-600 to-orange-600"
                    subtitle="Success rate"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Flows */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-widest uppercase">Recent Flows</h2>
                        <Link href="/dashboard/admin/flows" className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                            View All <FiArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {recentFlows.map((flow) => (
                            <div key={flow._id} className="p-6 rounded-3xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl ${flow.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'} flex items-center justify-center font-black`}>
                                        <FiLayout size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">{flow.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-[200px]">{flow.nodes} Nodes • Last edited {flow.lastEdited}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${flow.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {flow.status}
                                    </span>
                                    <Link href={`/builder?id=${flow._id}`}>
                                        <button className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                            <FiArrowRight size={18} />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-widest uppercase">Shortcuts</h2>
                    <div className="grid gap-4">
                        <QuickLink title="Create Custom Node" icon={FiLayout} color="text-blue-600" />
                        <QuickLink title="Manage API Keys" icon={FiCpu} color="text-purple-600" />
                        <QuickLink title="Invite Team Members" icon={FiUsers} color="text-emerald-600" />
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden group shadow-2xl shadow-blue-500/20">
                            <FiActivity className="absolute -right-8 -bottom-8 w-32 h-32 opacity-10 group-hover:scale-125 transition-transform duration-700" />
                            <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Build Higher</h3>
                            <p className="text-xs text-blue-100 font-bold uppercase tracking-widest mb-6">Explore advanced components</p>
                            <button className="px-6 py-3 bg-white text-blue-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:shadow-lg transition-all">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const QuickLink = ({ title, icon: Icon, color }) => (
    <button className="w-full p-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-gray-300 transition-all">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center ${color}`}>
                <Icon size={18} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{title}</span>
        </div>
        <FiArrowRight className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" size={14} />
    </button>
);
