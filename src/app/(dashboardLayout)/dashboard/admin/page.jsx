"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    FiMessageSquare,
    FiPlus,
    FiActivity,
    FiRefreshCw,
    FiArrowRight,
    FiLayout,
    FiGrid,
    FiDatabase,
    FiClock,
    FiTrendingUp
} from "react-icons/fi";
import { flowService, spreadsheetService } from "@/services/api";

const StatsCard = ({ title, value, icon: Icon, gradient, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative group p-6 rounded-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-600 transition-all duration-300 shadow-sm"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</h3>
                {subtitle && <p className="text-[10px] text-gray-400 mt-2 font-normal uppercase tracking-widest opacity-70">{subtitle}</p>}
            </div>
            <div className={`w-12 h-12 rounded-md bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-500`}>
                <Icon size={20} />
            </div>
        </div>
    </motion.div>
);

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        totalFlows: 0,
        activeFlows: 0,
        totalSheets: 0,
        totalRows: 0,
        recentFlows: [],
        recentSheets: []
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [flowsRes, sheetsRes] = await Promise.all([
                flowService.getAll(),
                spreadsheetService.getAll()
            ]);

            const flows = flowsRes.data || [];
            const sheets = sheetsRes.data || [];

            let totalRows = 0;
            sheets.forEach(s => {
                const sheetData = s.data || [];
                // Average rows estimation or find max row index
                const maxRow = sheetData.reduce((max, cell) => Math.max(max, cell.row || 0), 0);
                totalRows += maxRow;
            });

            setData({
                totalFlows: flows.length,
                activeFlows: flows.filter(f => f.isActive).length,
                totalSheets: sheets.length,
                totalRows: totalRows,
                recentFlows: flows.slice(0, 4),
                recentSheets: sheets.slice(0, 4)
            });
        } catch (e) {
            console.error("Failed to fetch dashboard stats", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight uppercase leading-none">
                        OVER<span className="text-blue-600">VIEW</span>
                    </h1>
                    <p className="text-gray-400 font-normal mt-2 tracking-widest uppercase text-[10px]">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchData} className={`p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-600 transition-all ${loading ? 'animate-spin' : ''}`}>
                        <FiRefreshCw size={18} />
                    </button>
                    <Link href="/builder">
                        <button className="px-6 py-3 bg-blue-600 text-white font-semibold text-[11px] uppercase tracking-widest rounded-md hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 active:scale-95">
                            <FiPlus size={14} /> New Flow
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Bot Flows"
                    value={data.totalFlows}
                    icon={FiLayout}
                    gradient="from-blue-600 to-indigo-600"
                    subtitle={`${data.activeFlows} Active Agents`}
                />
                <StatsCard
                    title="Spreadsheets"
                    value={data.totalSheets}
                    icon={FiGrid}
                    gradient="from-emerald-600 to-teal-600"
                    subtitle="Data Management"
                />
                <StatsCard
                    title="Database Rows"
                    value={data.totalRows}
                    icon={FiDatabase}
                    gradient="from-purple-600 to-pink-600"
                    subtitle="Synced Records"
                />
                <StatsCard
                    title="Performance"
                    value="99.9%"
                    icon={FiTrendingUp}
                    gradient="from-amber-600 to-orange-600"
                    subtitle="Uptime Status"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent flows */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight uppercase">Recent Bot Flows</h2>
                        <Link href="/dashboard/admin/flows" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                            View All <FiArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid gap-3">
                        {data.recentFlows.map((flow) => (
                            <div key={flow._id} className="p-4 rounded-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:border-blue-600/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-md ${flow.isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'} flex items-center justify-center`}>
                                        <FiLayout size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white uppercase tracking-tight text-[13px]">{flow.name}</h4>
                                        <p className="text-[9px] text-gray-400 font-normal uppercase tracking-widest mt-0.5">
                                            {flow.nodes?.length || 0} Nodes • Updated {new Date(flow.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <Link href={`/builder?flowId=${flow._id}`}>
                                    <button className="p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                                        <FiArrowRight size={16} />
                                    </button>
                                </Link>
                            </div>
                        ))}
                        {data.totalFlows === 0 && !loading && (
                            <div className="p-8 text-center text-gray-400 font-normal uppercase text-[10px] tracking-widest bg-gray-50 dark:bg-gray-800/50 rounded-md border border-dashed">
                                No flows created yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Spreadsheets */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight uppercase">Active Spreadsheets</h2>
                        <Link href="/dashboard/admin/spreadsheet" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                            View All <FiArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid gap-3">
                        {data.recentSheets.map((sheet) => (
                            <div key={sheet._id} className="p-4 rounded-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:border-emerald-600/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                                        <FiGrid size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white uppercase tracking-tight text-[13px]">{sheet.name}</h4>
                                        <p className="text-[9px] text-gray-400 font-normal uppercase tracking-widest mt-0.5">
                                            {(sheet.data?.length || 0)} Cells • Updated {new Date(sheet.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <Link href={`/dashboard/admin/spreadsheet/${sheet._id}`}>
                                    <button className="p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all">
                                        <FiArrowRight size={16} />
                                    </button>
                                </Link>
                            </div>
                        ))}
                        {data.totalSheets === 0 && !loading && (
                            <div className="p-8 text-center text-gray-400 font-normal uppercase text-[10px] tracking-widest bg-gray-50 dark:bg-gray-800/50 rounded-md border border-dashed">
                                No spreadsheets found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions / Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-md bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden group shadow-lg md:col-span-2">
                    <FiActivity className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold tracking-tight uppercase mb-2 leading-none">AI Integration Ready</h3>
                        <p className="text-[10px] text-blue-100 font-normal uppercase tracking-widest mb-8 max-w-sm">
                            Connect your conversation flows with external APIs and data sources using our advanced logic nodes.
                        </p>
                        <Link href="/builder">
                            <button className="px-6 py-3 bg-white text-blue-600 font-bold text-[11px] uppercase tracking-widest rounded-md hover:shadow-lg transition-all active:scale-95">
                                LAUNCH FLOW BUILDER
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-md p-8 border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center text-center">
                    <div className="w-14 h-14 rounded-md bg-orange-100 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center mb-4">
                        <FiClock size={28} />
                    </div>
                    <h4 className="text-base font-bold uppercase tracking-tight">System Status</h4>
                    <p className="text-[10px] text-gray-400 font-normal uppercase tracking-widest mt-2 px-4">
                        All modules are operational and synced with backend.
                    </p>
                </div>
            </div>
        </div>
    );
}
