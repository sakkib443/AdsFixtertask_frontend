"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { FiAward, FiShield, FiGlobe, FiZap } from "react-icons/fi";

const partners = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg" },
    { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
    { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
    { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
];

const achievements = [
    { icon: FiAward, value: "50+", label: "Industry Awards" },
    { icon: FiShield, value: "99.9%", label: "Uptime SLA" },
    { icon: FiGlobe, value: "150+", label: "Countries" },
    { icon: FiZap, value: "24/7", label: "Premium Support" },
];

export default function ClientLogos() {
    const { language } = useLanguage();

    return (
        <section className="py-28 bg-gray-50 dark:bg-gray-900">
            <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">

                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-5">
                        <FiAward className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary uppercase tracking-wider">
                            {language === 'bn' ? 'বিশ্বস্ত পার্টনার' : 'Trusted Partners'}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white font-heading uppercase mb-5">
                        {language === 'bn' ? 'শিল্পের শীর্ষস্থানীয়দের' : "Powering the World's"}
                        <br />
                        <span className="text-primary">
                            {language === 'bn' ? 'দ্বারা বিশ্বাসযোগ্য' : 'Leading Brands'}
                        </span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        {language === 'bn'
                            ? 'Fortune 500 কোম্পানি থেকে শুরু করে স্টার্টআপ পর্যন্ত, হাজারো টিম তাদের ডিজিটাল প্রোডাক্ট তৈরিতে আমাদের প্ল্যাটফর্ম ব্যবহার করে।'
                            : 'From Fortune 500 companies to startups, thousands of teams use our platform to build their digital products.'}
                    </p>
                </motion.div>

                {/* Logo Marquee */}
                <div className="relative mb-16 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10" />

                    <motion.div
                        className="flex gap-16 items-center"
                        animate={{ x: [0, -1200] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                        {[...partners, ...partners, ...partners].map((partner, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500 cursor-pointer"
                            >
                                <div className="w-36 h-16 flex items-center justify-center p-3">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-w-full max-h-full object-contain filter dark:invert"
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Achievement Stats */}
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-5"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {achievements.map((item, i) => (
                        <motion.div
                            key={i}
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-all duration-300 hover:shadow-lg text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                <item.icon className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{item.value}</p>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Recognition Badges */}
                <motion.div
                    className="text-center mt-14 pt-14 border-t border-gray-200 dark:border-gray-800"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5">
                        {language === 'bn' ? 'স্বীকৃতি' : 'Recognized By'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 items-center">
                        {['Awwwards', 'CSS Design Awards', 'Product Hunt', 'Webby Awards', 'FWA'].map((award, i) => (
                            <motion.div
                                key={i}
                                className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 font-medium text-sm hover:border-primary hover:text-primary transition-all cursor-pointer"
                                whileHover={{ scale: 1.03 }}
                            >
                                🏆 {award}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
