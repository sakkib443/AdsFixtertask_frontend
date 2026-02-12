"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useRef } from "react";

export default function Hero() {
    const { t, language } = useLanguage();
    const containerRef = useRef(null);

    // Parallax effects for decorative elements
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const rotate = useTransform(scrollY, [0, 1000], [0, 45]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#F5F5F5] dark:bg-gray-950"
        >
            {/* Background Decorative Elements */}
            <motion.div
                style={{ y: y1, rotate }}
                className="absolute top-[10%] -left-20 w-[400px] h-[400px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[100px] -z-10"
            />
            <motion.div
                style={{ y: y2 }}
                className="absolute bottom-[10%] -right-20 w-[500px] h-[500px] rounded-full bg-secondary/5 dark:bg-white/5 blur-[120px] -z-10"
            />

            {/* Subtle Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]"
                style={{
                    backgroundImage: `linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Floating Shapes */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-[15%] w-12 h-12 border-2 border-primary/30 rounded-lg hidden lg:block"
            />
            <motion.div
                animate={{
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 left-[10%] w-16 h-16 border-2 border-secondary/10 dark:border-white/10 rounded-full hidden lg:block"
            />

            <motion.div
                className="container relative z-10 px-6 lg:px-12 max-w-[1240px] mx-auto text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Section Label */}
                <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                        {t('heroDesigner')}
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    variants={itemVariants}
                    className="text-6xl md:text-8xl lg:text-9xl font-bold text-secondary dark:text-white mb-6 leading-[0.9] tracking-tight"
                >
                    {t('heroAbuSayeed').split(' ').map((word, i) => (
                        <span key={i} className={i === 1 ? "text-primary block md:inline" : "block md:inline mr-4"}>
                            {word}
                        </span>
                    ))}
                </motion.h1>

                {/* Description */}
                <motion.p
                    variants={itemVariants}
                    className="max-w-2xl mx-auto text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-16"
                >
                    {t('heroDesc')}
                </motion.p>

                {/* Cards Section */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-10"
                >
                    {/* Design Card */}
                    <Link href="/graphics" className="group flex-1 max-w-sm mx-auto md:mx-0">
                        <motion.div
                            className="h-full bg-secondary dark:bg-gray-900 rounded-[2.5rem] p-10 text-left cursor-pointer transition-all duration-500 relative overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                            whileHover={{ y: -10 }}
                        >
                            {/* Decorative element */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />

                            <div>
                                <h2 className="text-4xl font-bold text-primary mb-6 leading-none uppercase">
                                    {t('heroDesign')}
                                </h2>
                                <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {t('heroDesignDesc')}
                                </p>
                            </div>

                            <div className="mt-10 flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                                <span>Explore Marketplace</span>
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    →
                                </motion.span>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Training Card */}
                    <Link href="/courses" className="group flex-1 max-w-sm mx-auto md:mx-0">
                        <motion.div
                            className="h-full bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-10 text-left cursor-pointer transition-all duration-500 relative overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                            whileHover={{ y: -10 }}
                        >
                            {/* Decorative element */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 dark:bg-white/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                            <div>
                                <h2 className="text-4xl font-bold text-secondary dark:text-white mb-6 leading-none uppercase">
                                    {t('heroTraining')}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                    {t('heroTrainingDesc')}
                                </p>
                            </div>

                            <div className="mt-10 flex items-center gap-2 text-secondary dark:text-white font-bold text-sm tracking-widest uppercase">
                                <span>Browse Courses</span>
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    →
                                </motion.span>
                            </div>
                        </motion.div>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Bottom Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
            </motion.div>
        </section>
    );
}
