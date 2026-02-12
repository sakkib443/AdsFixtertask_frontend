"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
    FiArrowUpRight, FiMail, FiSend, FiPlay, FiCheck,
    FiDownload, FiUsers, FiStar, FiGlobe
} from "react-icons/fi";
import {
    FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram,
    FaDribbble, FaBehance, FaYoutube, FaGithub
} from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const stats = [
    { icon: FiDownload, value: "10M+", label: "Downloads", labelBn: "ডাউনলোড" },
    { icon: FiUsers, value: "500K+", label: "Creators", labelBn: "ক্রিয়েটর" },
    { icon: FiStar, value: "4.9", label: "Rating", labelBn: "রেটিং" },
    { icon: FiGlobe, value: "150+", label: "Countries", labelBn: "দেশ" },
];

const features = [
    { text: "Unlimited Downloads", textBn: "আনলিমিটেড ডাউনলোড" },
    { text: "Commercial License", textBn: "কমার্শিয়াল লাইসেন্স" },
    { text: "24/7 Support", textBn: "২৪/৭ সাপোর্ট" },
    { text: "Free Updates", textBn: "ফ্রি আপডেট" },
];

const socialLinks = [
    { icon: FaDribbble, href: "#", label: "Dribbble" },
    { icon: FaBehance, href: "#", label: "Behance" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
    { icon: FaGithub, href: "#", label: "GitHub" },
    { icon: FaFacebookF, href: "#", label: "Facebook" },
];

const quickLinks = {
    marketplace: [
        { name: "Graphics", nameBn: "গ্রাফিক্স", href: "/graphics" },
        { name: "UI/UX Kits", nameBn: "UI/UX কিট", href: "/ui-kits" },
        { name: "Fonts", nameBn: "ফন্ট", href: "/fonts" },
        { name: "Photos", nameBn: "ফটো", href: "/photos" },
        { name: "Audio", nameBn: "অডিও", href: "/audio" },
    ],
    learning: [
        { name: "All Courses", nameBn: "সব কোর্স", href: "/courses" },
        { name: "Design", nameBn: "ডিজাইন", href: "/courses?category=design" },
        { name: "Development", nameBn: "ডেভেলপমেন্ট", href: "/courses?category=development" },
        { name: "Business", nameBn: "বিজনেস", href: "/courses?category=business" },
    ],
    support: [
        { name: "Help Center", nameBn: "হেল্প সেন্টার", href: "/help" },
        { name: "License", nameBn: "লাইসেন্স", href: "/license" },
        { name: "Refunds", nameBn: "রিফান্ড", href: "/refund" },
        { name: "Contact", nameBn: "যোগাযোগ", href: "/contact" },
    ]
};

export default function FooterCTA() {
    const [email, setEmail] = useState("");
    const { language } = useLanguage();

    return (
        <footer className="relative overflow-hidden">
            {/* Main CTA Section - Soft Background */}
            <section className="relative bg-gray-50 dark:bg-gray-900 py-24">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

                        {/* Left: CTA Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                    {language === 'bn' ? 'আজই শুরু করুন' : 'Start Today'}
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white font-heading uppercase leading-[0.95] mb-6">
                                {language === 'bn' ? 'তৈরি করতে' : 'Ready to'}
                                <br />
                                <span className="text-primary">
                                    {language === 'bn' ? 'শুরু করুন?' : 'Create?'}
                                </span>
                            </h2>

                            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg">
                                {language === 'bn'
                                    ? 'হাজারো ক্রিয়েটরদের সাথে যোগ দিন যারা প্রিমিয়াম ডিজিটাল অ্যাসেট দিয়ে তাদের আইডিয়া বাস্তবে রূপ দিচ্ছে।'
                                    : 'Join thousands of creators bringing their ideas to life with premium digital assets.'}
                            </p>

                            {/* Feature Pills */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                {features.map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <FiCheck className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                            {language === 'bn' ? feature.textBn : feature.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-black font-bold uppercase text-sm tracking-wider rounded-full hover:bg-primary/90 transition-colors"
                                    >
                                        {language === 'bn' ? 'ফ্রি অ্যাকাউন্ট' : 'Get Started Free'}
                                        <FiArrowUpRight className="w-5 h-5" />
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <button className="inline-flex items-center gap-3 px-7 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold uppercase text-sm tracking-wider rounded-full hover:border-primary hover:text-primary transition-colors">
                                        <FiPlay className="w-5 h-5" />
                                        {language === 'bn' ? 'ভিডিও দেখুন' : 'Watch Demo'}
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right: Stats & Contact */}
                        <motion.div
                            className="space-y-8"
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        className="p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-center hover:border-primary/30 transition-colors"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <stat.icon className="w-7 h-7 text-primary mx-auto mb-2" />
                                        <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                            {language === 'bn' ? stat.labelBn : stat.label}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Contact Card */}
                            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                    {language === 'bn' ? 'প্রশ্ন আছে?' : 'Have Questions?'}
                                </h4>
                                <a
                                    href="mailto:support@creativehub.com"
                                    className="flex items-center gap-3 text-xl font-bold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors group"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <FiMail className="w-5 h-5 text-primary" />
                                    </div>
                                    support@creativehub.com
                                    <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </div>

                            {/* Social Links */}
                            <div>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-4">
                                    {language === 'bn' ? 'আমাদের ফলো করুন' : 'Follow Us'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {socialLinks.map((social, i) => (
                                        <motion.a
                                            key={i}
                                            href={social.href}
                                            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-primary hover:border-primary hover:text-black transition-all"
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            aria-label={social.label}
                                        >
                                            <social.icon size={16} />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer Links Section - Soft Background */}
            <div className="bg-gray-100 dark:bg-gray-900 py-16 border-t border-gray-200 dark:border-gray-800">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                    <span className="text-black font-black text-xl">C</span>
                                </div>
                                <span className="text-xl font-black text-gray-900 dark:text-white">CreativeHub</span>
                            </Link>
                            <p className="text-gray-500 dark:text-gray-400 mb-5 max-w-sm text-sm">
                                {language === 'bn'
                                    ? 'বিশ্বের শীর্ষ ডিজিটাল অ্যাসেট মার্কেটপ্লেস। হাজারো ক্রিয়েটর এবং ডেভেলপারদের পছন্দ।'
                                    : "The world's leading digital asset marketplace. Trusted by thousands of creators and developers."}
                            </p>

                            {/* Newsletter */}
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder={language === 'bn' ? 'ইমেইল লিখুন...' : 'Enter email...'}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary text-sm"
                                />
                                <motion.button
                                    className="w-11 h-11 bg-primary rounded-lg flex items-center justify-center text-black"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiSend size={16} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Marketplace Links */}
                        <div>
                            <h5 className="text-gray-900 dark:text-white font-bold uppercase tracking-wider text-sm mb-5">
                                {language === 'bn' ? 'মার্কেটপ্লেস' : 'Marketplace'}
                            </h5>
                            <ul className="space-y-2.5">
                                {quickLinks.marketplace.map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm">
                                            {language === 'bn' ? link.nameBn : link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Learning Links */}
                        <div>
                            <h5 className="text-gray-900 dark:text-white font-bold uppercase tracking-wider text-sm mb-5">
                                {language === 'bn' ? 'শেখা' : 'Learning'}
                            </h5>
                            <ul className="space-y-2.5">
                                {quickLinks.learning.map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm">
                                            {language === 'bn' ? link.nameBn : link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h5 className="text-gray-900 dark:text-white font-bold uppercase tracking-wider text-sm mb-5">
                                {language === 'bn' ? 'সাপোর্ট' : 'Support'}
                            </h5>
                            <ul className="space-y-2.5">
                                {quickLinks.support.map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm">
                                            {language === 'bn' ? link.nameBn : link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} CreativeHub. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                                {language === 'bn' ? 'প্রাইভেসি' : 'Privacy'}
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">
                                {language === 'bn' ? 'শর্তাবলী' : 'Terms'}
                            </Link>
                            <Link href="/cookies" className="text-gray-400 hover:text-primary transition-colors">
                                {language === 'bn' ? 'কুকিজ' : 'Cookies'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
