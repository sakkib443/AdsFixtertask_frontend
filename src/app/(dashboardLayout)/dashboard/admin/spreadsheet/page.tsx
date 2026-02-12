"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiGrid, FiFileText, FiTrash2, FiClock, FiSearch, FiArrowRight } from "react-icons/fi";
import { spreadsheetService } from "@/services/api";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SpreadsheetListPage() {
    const [spreadsheets, setSpreadsheets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchSpreadsheets();
    }, []);

    const fetchSpreadsheets = async () => {
        try {
            const response = await spreadsheetService.getAll();
            if (response.success) {
                setSpreadsheets(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch spreadsheets", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const name = prompt("Enter spreadsheet name:", "Untitled Spreadsheet");
            if (!name) return;

            const response = await spreadsheetService.create({ name, data: [] });
            if (response.success) {
                toast.success("Spreadsheet created!");
                fetchSpreadsheets();
            }
        } catch (error) {
            toast.error("Failed to create spreadsheet");
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this spreadsheet?")) return;

        try {
            const response = await spreadsheetService.delete(id);
            if (response.success) {
                toast.success("Deleted successfully");
                fetchSpreadsheets();
            }
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const filtered = spreadsheets.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
                        MY <span className="text-green-600">SHEETS</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Manage and collaborate on your data grids.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-600/20 active:scale-95"
                >
                    <FiPlus size={18} />
                    New Spreadsheet
                </button>
            </div>

            {/* Search & Stats */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search spreadsheets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-transparent focus:border-green-600/20 rounded-2xl outline-none transition-all shadow-sm font-medium"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filtered.map((sheet: any) => (
                        <motion.div
                            key={sheet._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                        >
                            <Link href={`/dashboard/admin/spreadsheet/${sheet._id}`}>
                                <div className="group bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-transparent hover:border-green-600/20 transition-all shadow-sm hover:shadow-xl relative overflow-hidden h-full flex flex-col">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleDelete(sheet._id, e)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <FiGrid size={28} />
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2 truncate">
                                        {sheet.name}
                                    </h3>

                                    <div className="mt-auto space-y-3 pt-6 border-t border-gray-50 dark:border-gray-700">
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                            <FiClock size={14} />
                                            Updated {new Date(sheet.updatedAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-md">
                                                Active
                                            </span>
                                            <div className="text-green-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                                <FiArrowRight />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-[250px] bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
                        ))}
                    </>
                )}

                {!isLoading && filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <FiFileText size={40} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">No sheets found</h3>
                            <p className="text-gray-500 font-medium">Create your first spreadsheet to get started.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
