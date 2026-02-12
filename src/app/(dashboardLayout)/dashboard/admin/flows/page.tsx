"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPlus, FiEdit3, FiTrash2, FiCopy, FiPlay, FiPause,
    FiSearch, FiClock, FiArrowRight, FiDownload, FiUpload,
    FiCheckCircle, FiAlertCircle, FiLayout
} from "react-icons/fi";
import { flowService } from "@/services/api";
import Link from "next/link";
import toast from "react-hot-toast";

export default function FlowManagementPage() {
    const [flows, setFlows] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newFlowName, setNewFlowName] = useState("");

    useEffect(() => { fetchFlows(); }, []);

    const fetchFlows = async () => {
        try {
            const res = await flowService.getAll();
            if (res.success) setFlows(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newFlowName.trim()) return toast.error("Please enter a flow name");
        try {
            const res = await flowService.create({
                name: newFlowName,
                nodes: [{ id: 'node-1', type: 'start', position: { x: 400, y: 50 }, data: { label: 'START' } }],
                edges: [],
                isActive: false,
            });
            if (res.success) {
                toast.success("Flow created!");
                setNewFlowName("");
                setShowCreateModal(false);
                fetchFlows();
            }
        } catch (e) { toast.error("Failed to create flow"); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this flow?")) return;
        try {
            await flowService.delete(id);
            toast.success("Flow deleted");
            fetchFlows();
        } catch (e) { toast.error("Failed to delete"); }
    };

    const handleDuplicate = async (id: string) => {
        try {
            await flowService.duplicate(id);
            toast.success("Flow duplicated!");
            fetchFlows();
        } catch (e) { toast.error("Failed to duplicate"); }
    };

    const handleToggleActive = async (id: string) => {
        try {
            await flowService.toggleActive(id);
            toast.success("Status updated!");
            fetchFlows();
        } catch (e) { toast.error("Failed to toggle status"); }
    };

    const handleExport = (flow: any) => {
        const json = JSON.stringify({ name: flow.name, nodes: flow.nodes, edges: flow.edges }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${flow.name.replace(/\s+/g, '_')}_flow.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Flow exported as JSON!");
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;
            const text = await file.text();
            try {
                const data = JSON.parse(text);
                const res = await flowService.create({
                    name: data.name || `Imported Flow`,
                    nodes: data.nodes || [],
                    edges: data.edges || [],
                    isActive: false,
                });
                if (res.success) {
                    toast.success("Flow imported successfully!");
                    fetchFlows();
                }
            } catch (err) { toast.error("Invalid JSON file"); }
        };
        input.click();
    };

    const filtered = flows.filter(f =>
        f.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = flows.filter(f => f.isActive).length;

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
                        FLOW <span className="text-blue-600">MANAGER</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Create, manage, and deploy your chatbot conversation flows.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleImport}
                        className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                        <FiUpload size={16} />
                        Import
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                    >
                        <FiPlus size={18} />
                        New Flow
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Flows</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{flows.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500">Active</p>
                    <p className="text-3xl font-black text-green-600 mt-1">{activeCount}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Inactive</p>
                    <p className="text-3xl font-black text-yellow-600 mt-1">{flows.length - activeCount}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative group">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                    type="text"
                    placeholder="Search flows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-transparent focus:border-blue-600/20 rounded-2xl outline-none transition-all shadow-sm font-medium"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filtered.map((flow: any) => (
                        <motion.div
                            key={flow._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className="group bg-white dark:bg-gray-800 rounded-3xl border-2 border-transparent hover:border-blue-600/20 transition-all shadow-sm hover:shadow-xl overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500">
                                            <FiLayout size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black tracking-tight">{flow.name}</h3>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                                                v{flow.version || 1} · {flow.nodes?.length || 0} nodes
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleToggleActive(flow._id)}
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${flow.isActive
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                            }`}
                                    >
                                        {flow.isActive ? (
                                            <span className="flex items-center gap-1"><FiCheckCircle size={12} /> Active</span>
                                        ) : (
                                            <span className="flex items-center gap-1"><FiAlertCircle size={12} /> Inactive</span>
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-6">
                                    <FiClock size={14} />
                                    Updated {new Date(flow.updatedAt).toLocaleDateString()}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Link
                                        href={`/builder?flowId=${flow._id}`}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                                    >
                                        <FiEdit3 size={14} /> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDuplicate(flow._id)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                                    >
                                        <FiCopy size={14} /> Copy
                                    </button>
                                    <button
                                        onClick={() => handleExport(flow)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                                    >
                                        <FiDownload size={14} /> JSON
                                    </button>
                                    <button
                                        onClick={() => handleDelete(flow._id)}
                                        className="flex items-center gap-1.5 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ml-auto"
                                    >
                                        <FiTrash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && [1, 2, 3].map(i => (
                    <div key={i} className="h-[250px] bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
                ))}

                {!isLoading && filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <FiLayout size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">No flows found</h3>
                        <p className="text-gray-500 font-medium">Create your first chatbot flow to get started.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-black tracking-tighter uppercase mb-6">Create New Flow</h2>
                            <input
                                type="text"
                                placeholder="Flow name (e.g., Customer Support Bot)"
                                value={newFlowName}
                                onChange={(e) => setNewFlowName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                autoFocus
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-transparent focus:border-blue-600/20 outline-none font-medium mb-6"
                            />
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-5 py-3.5 bg-gray-100 dark:bg-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 px-5 py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                                >
                                    Create Flow
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
