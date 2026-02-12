"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
    FiMenu,
    FiX,
    FiGrid,
    FiLogOut,
    FiSettings,
    FiLayout,
    FiChevronDown,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { selectCurrentUser, selectIsAuthenticated, logout } from "@/redux/features/authSlice";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { theme } = useTheme();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "HOME", href: "/" },
        { name: "DASHBOARD", href: "/dashboard/admin" },
    ];

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg shadow-sm" : "bg-transparent"}`}>
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        <FiLayout size={18} />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight uppercase">Flow<span className="text-blue-600">Builder</span></span>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-[10px] font-bold text-gray-500 hover:text-blue-600 transition-colors tracking-widest uppercase">
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {mounted && (isAuthenticated && user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                    {user.firstName?.[0] || "A"}
                                </div>
                                <FiChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-gray-900 rounded-md shadow-2xl border border-gray-100 dark:border-gray-800 py-2 overflow-hidden"
                                    >
                                        <div className="px-4 py-2 border-b dark:border-gray-800">
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                                            <p className="text-[9px] text-gray-500 truncate uppercase mt-0.5 tracking-wider font-normal">{user.role}</p>
                                        </div>
                                        <DropdownLink href="/dashboard/admin" icon={FiGrid} label="Admin Dashboard" />
                                        <DropdownLink href="/dashboard/admin/profile" icon={FiSettings} label="Settings" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all uppercase tracking-tighter"
                                        >
                                            <FiLogOut size={14} /> Log Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href="/login">
                            <button className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold rounded-md hover:opacity-90 transition-opacity tracking-widest uppercase">
                                Sign In
                            </button>
                        </Link>
                    ))}

                    <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 text-gray-900 dark:text-white">
                        {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="fixed inset-0 top-20 bg-white dark:bg-gray-950 z-[100] p-6 lg:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function DropdownLink({ href, icon: Icon, label }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-2 text-[10px] font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-all uppercase tracking-wider"
        >
            <Icon size={14} /> {label}
        </Link>
    );
}
