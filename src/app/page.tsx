"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiMessageSquare, FiZap, FiLayout, FiActivity, FiCpu, FiCheck } from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 selection:bg-blue-100 dark:selection:bg-blue-900/30">
            <Navbar />

            {/* Hero Section */}
            <main className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Subtle Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
                    <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-10"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-md text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Next-Gen Automation Platform
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                                    Architect your <br />
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">conversations</span> <br />
                                    with precision.
                                </h1>
                                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl font-normal leading-relaxed">
                                    The most intuitive node-based builder for modern teams. Design, test, and deploy complex conversation flows without writing a single line of code.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <Link href="/dashboard/admin/flows">
                                    <button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] uppercase tracking-widest rounded-md transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 flex items-center gap-2">
                                        Launch Platform <FiArrowRight size={14} />
                                    </button>
                                </Link>
                                <Link href="/login">
                                    <button className="h-12 px-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold text-[11px] uppercase tracking-widest rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                                        View Demo
                                    </button>
                                </Link>
                            </div>

                            <div className="flex items-center gap-12 pt-4">
                                <StatItem label="Active Users" value="12k+" />
                                <StatItem label="Automations" value="85k+" />
                                <StatItem label="Uptime" value="99.9%" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="relative lg:block hidden h-[500px]"
                        >
                            {/* Main Canvas Container */}
                            <div className="relative z-10 w-full h-full p-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(#3b82f608_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-100" />

                                {/* Floating Tool Header */}
                                <div className="absolute top-0 left-0 right-0 h-10 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center px-4 justify-between">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-red-400/20" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-400/20" />
                                        <div className="w-2 h-2 rounded-full bg-green-400/20" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-12 bg-blue-500/10 rounded-full" />
                                        <div className="h-4 w-4 bg-gray-100 dark:bg-gray-800 rounded-sm" />
                                    </div>
                                </div>

                                {/* Center Node (Process Engine) */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 p-4 bg-white dark:bg-gray-900 rounded-md border-2 border-blue-500/20 shadow-2xl z-20"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40">
                                            <FiActivity size={16} />
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
                                            <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">LIVE</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-1.5 w-full bg-gray-50 dark:bg-gray-800 rounded-full" />
                                        <div className="h-1.5 w-4/5 bg-gray-50 dark:bg-gray-800 rounded-full" />
                                    </div>
                                </motion.div>

                                {/* Trigger Node */}
                                <motion.div
                                    style={{ left: '10%', top: '22%' }}
                                    animate={{ y: [0, 8, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute w-40 p-3 bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-xl opacity-90 hidden xl:block"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                            <FiMessageSquare size={12} />
                                        </div>
                                        <div className="h-1 w-10 bg-gray-100 dark:bg-gray-800 rounded-full" />
                                    </div>
                                    <div className="h-3 w-full bg-emerald-500/5 rounded-sm" />
                                </motion.div>

                                {/* Response Node */}
                                <motion.div
                                    style={{ right: '10%', bottom: '25%' }}
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute w-40 p-3 bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-xl hidden xl:block"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-md bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                            <FiZap size={12} />
                                        </div>
                                        <div className="h-1 w-12 bg-gray-100 dark:bg-gray-800 rounded-full" />
                                    </div>
                                    <div className="h-3 w-full bg-purple-500/5 rounded-sm" />
                                </motion.div>

                                {/* Floating Stats Badge */}
                                <div className="absolute top-[15%] right-[15%] p-2 px-3 bg-white dark:bg-gray-900 border border-emerald-500/20 rounded-md shadow-lg flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">99.9% Latency</span>
                                </div>

                                {/* Connection SVG */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                                    <path d="M100,150 C200,150 200,250 250,250" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500" strokeDasharray="4" />
                                    <path d="M400,250 C450,250 450,400 550,400" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-500" strokeDasharray="4" />
                                </svg>
                            </div>

                            {/* Visual Glows */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/10 blur-[100px] -z-10" />
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-32">
                        <FeatureCard
                            icon={<FiLayout />}
                            title="Visual Orchestration"
                            desc="Complex logic shouldn't mean complex UI. Our canvas provides a clear mental model of your flows."
                        />
                        <FeatureCard
                            icon={<FiMessageSquare />}
                            title="Real-time Simulation"
                            desc="Test every path and edge case instantly with our production-grade sandbox environment."
                        />
                        <FeatureCard
                            icon={<FiCpu />}
                            title="Infinite Scalability"
                            desc="Powered by a high-performance engine designed to handle massive throughput with sub-ms latency."
                        />
                    </div>
                </div>
            </main>

            {/* Footer Placeholder for visual balance */}
            <footer className="py-12 px-6 border-t border-gray-100 dark:border-gray-800/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-normal uppercase tracking-[0.2em] text-gray-400">
                        &copy; 2026 CreativeHub Pro. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">Privacy</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">Terms</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">Github</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
            <p className="text-[9px] font-normal uppercase tracking-[0.1em] text-gray-500">{label}</p>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-10 bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/50 rounded-md hover:border-blue-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-blue-600 mb-8 border border-gray-100 dark:border-gray-700/50 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-normal leading-relaxed">{desc}</p>
        </div>
    );
}
