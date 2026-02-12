"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiHome,
    FiUsers,
    FiLayout,
    FiSettings,
    FiBarChart2,
    FiMenu,
    FiX,
    FiChevronDown,
    FiLogOut,
    FiBell,
    FiSearch,
    FiArrowLeft,
    FiGrid,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated, selectToken, logout } from "@/redux/features/authSlice";

const menuItems = [
    {
        name: "Dashboard",
        href: "/dashboard/admin",
        icon: FiHome,
        gradient: "from-indigo-500 to-purple-500"
    },
    {
        name: "Flow Manager",
        href: "/dashboard/admin/flows",
        icon: FiLayout,
        gradient: "from-cyan-500 to-blue-500"
    },
    {
        name: "Spreadsheets",
        href: "/dashboard/admin/spreadsheet",
        icon: FiGrid,
        gradient: "from-green-500 to-emerald-500"
    },
    {
        name: "Profile",
        href: "/dashboard/admin/profile",
        icon: FiUsers,
        gradient: "from-indigo-500 to-blue-500"
    },
];

function SidebarItem({ item, isCollapsed }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const isActive = item.href
        ? pathname === item.href
        : item.children?.some((child) => pathname === child.href);

    useEffect(() => {
        if (item.children && item.children.some(child => pathname === child.href)) {
            setIsOpen(true);
        }
    }, [pathname, item.children]);

    if (item.children) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`group w-full flex items-center justify-between px-3 py-3 rounded-md transition-all ${isActive
                        ? "bg-blue-50 dark:bg-blue-900/10 text-blue-600"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-md flex items-center justify-center ${isActive
                            ? `bg-gradient-to-br ${item.gradient} shadow-md`
                            : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                            } transition-all`}>
                            <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                        </div>
                        {!isCollapsed && <span className="font-normal text-sm uppercase tracking-tight">{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                        <FiChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                    )}
                </button>
                <AnimatePresence>
                    {isOpen && !isCollapsed && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-6 mt-1 space-y-1 overflow-hidden border-l-2 border-gray-100 dark:border-gray-700 pl-4"
                        >
                            {item.children.map((child) => (
                                <Link
                                    key={child.name}
                                    href={child.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === child.href
                                        ? "bg-blue-600 text-white font-medium shadow-lg"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600"
                                        }`}
                                >
                                    {child.icon && <child.icon className="w-4 h-4" />}
                                    <span>{child.name}</span>
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <Link
            href={item.href}
            className={`group flex items-center gap-3 px-3 py-3 rounded-md transition-all ${isActive
                ? "bg-blue-50 dark:bg-blue-900/10 text-blue-600"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
        >
            <div className={`w-9 h-9 rounded-md flex items-center justify-center ${isActive
                ? `bg-gradient-to-br ${item.gradient} shadow-md`
                : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                } transition-all`}>
                <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
            </div>
            {!isCollapsed && <span className="font-normal text-sm uppercase tracking-tight">{item.name}</span>}
        </Link>
    );
}

export default function DashboardLayout({ children }) {
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { theme } = useTheme();
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && (!token || !isAuthenticated)) {
            router.replace("/login");
        }
    }, [token, isAuthenticated, router, mounted]);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">Initializing...</p>
                </div>
            </div>
        );
    }

    if (!token || !isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-20"
                    } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:block`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-md bg-blue-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        {isSidebarOpen && (
                            <span className="text-lg font-bold">
                                {theme.logoText || "ChatbotFlow"}
                            </span>
                        )}
                    </Link>
                </div>

                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-500 hover:text-blue-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
                        {isSidebarOpen && <span className="text-sm font-normal">Back to Website</span>}
                    </Link>
                </div>

                <nav className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {isSidebarOpen && (
                        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            Main Menu
                        </p>
                    )}
                    {menuItems.map((item) => (
                        <SidebarItem key={item.name} item={item} isCollapsed={!isSidebarOpen} />
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <FiLogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -288 }}
                            animate={{ x: 0 }}
                            exit={{ x: -288 }}
                            className="fixed top-0 left-0 z-50 w-72 h-screen bg-white dark:bg-gray-800 lg:hidden"
                        >
                            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">C</span>
                                    </div>
                                    <span className="text-lg font-bold">
                                        {theme.logoText || "ChatbotFlow"}
                                    </span>
                                </Link>
                                <button onClick={() => setIsMobileOpen(false)}>
                                    <FiX className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                            <nav className="p-4 space-y-2">
                                {menuItems.map((item) => (
                                    <SidebarItem key={item.name} item={item} isCollapsed={false} />
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className={`${isSidebarOpen ? "lg:ml-72" : "lg:ml-20"} transition-all duration-300`}>
                <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FiMenu className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FiMenu className="w-5 h-5" />
                        </button>
                        <div className="relative hidden md:block">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-72 pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-blue-600 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <FiBell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>
                        <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <span className="text-white font-medium">
                                    {user?.firstName?.[0] || "A"}
                                </span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-semibold">
                                    {user?.firstName || "Admin"}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role || "admin"}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="min-h-[calc(100vh-4rem)] p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
