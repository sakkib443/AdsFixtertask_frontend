"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiMessageSquare, FiZap, FiLayout, FiActivity, FiCpu } from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                                <FiActivity className="animate-pulse" /> Senior Full-Stack Assessment 2026
                            </div>

                            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.9]">
                                NEXT GEN <br />
                                <span className="text-blue-600">CHATBOTS</span> <br />
                                WITHOUT CODE.
                            </h1>

                            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl font-medium leading-relaxed tracking-tight">
                                Design complex conversation logic effortlessly. Our visual canvas bridge the gap between imagination and live automated interactions.
                            </p>

                            <div className="flex flex-wrap items-center gap-5 pt-4">
                                <Link href="/builder">
                                    <button className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-3xl flex items-center gap-3 transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-500/30">
                                        Start Building Now <FiArrowRight size={18} />
                                    </button>
                                </Link>
                                <Link href="/login">
                                    <button className="px-10 py-5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-black text-xs uppercase tracking-widest rounded-3xl transition-all">
                                        Explore Docs
                                    </button>
                                </Link>
                            </div>

                            <div className="flex items-center gap-8 pt-10">
                                <StatItem label="Active Users" value="12k+" />
                                <div className="w-[1px] h-10 bg-gray-200 dark:bg-gray-800" />
                                <StatItem label="Flows Built" value="85k+" />
                                <div className="w-[1px] h-10 bg-gray-200 dark:bg-gray-800" />
                                <StatItem label="Success Rate" value="99.9%" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            className="relative group"
                        >
                            {/* Decorative Background */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[4rem] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity" />

                            {/* Visual Representation of Builder */}
                            <div className="relative aspect-[4/3] rounded-[3rem] bg-white dark:bg-gray-900 border-8 border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-grid-pattern opacity-5" />

                                {/* Floating Nodes Simulation */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute top-1/4 left-1/4 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 w-48"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-2">
                                        <FiMessageSquare />
                                    </div>
                                    <div className="h-2 w-3/4 bg-gray-100 dark:bg-gray-700 rounded mb-1" />
                                    <div className="h-2 w-1/2 bg-gray-100 dark:bg-gray-700 rounded" />
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    className="absolute bottom-1/4 right-1/4 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 w-48"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-2">
                                        <FiCpu />
                                    </div>
                                    <div className="h-2 w-2/3 bg-gray-100 dark:bg-gray-700 rounded mb-1" />
                                    <div className="h-2 w-1/3 bg-gray-100 dark:bg-gray-700 rounded" />
                                </motion.div>

                                {/* Connection Line Simulator */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <path d="M200,200 Q300,300 400,400" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-blue-500/30" />
                                </svg>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-32">
                        <FeatureCard
                            icon={<FiLayout />}
                            title="VISUAL DRAG & DROP"
                            desc="No logic is too complex for our intuitive node-based canvas. Connect components seamlessly."
                        />
                        <FeatureCard
                            icon={<FiMessageSquare />}
                            title="INSTANT TEST DRIVE"
                            desc="Don't guess. Test your flows in real-time with our integrated Socket.io preview environment."
                        />
                        <FeatureCard
                            icon={<FiZap />}
                            title="SCALABLE ENGINE"
                            desc="Built on Node.js and MongoDB, our execution engine handles thousands of parallel sessions."
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{label}</p>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-left space-y-6 group hover:border-blue-500 transition-all duration-500">
            <div className="w-16 h-16 rounded-[1.25rem] bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <div className="space-y-2">
                <h3 className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-widest">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
