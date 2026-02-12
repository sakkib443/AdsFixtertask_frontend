import React from 'react';
import { FiSave, FiDownload, FiPlay, FiShare2, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import useFlowStore from '@/store/useFlowStore';

const BuilderHeader = ({ onTest }: { onTest: () => void }) => {
    const { nodes, edges } = useFlowStore();

    const handleSave = async () => {
        const flowData = { nodes, edges };
        console.log('Saving Flow:', flowData);
        // TODO: Connect to Backend API
        alert('Flow Saved (Simulation)! Check console for JSON structure.');
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "chatbot-flow.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <header className="h-20 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-8 flex items-center justify-between z-20 shadow-sm">
            <div className="flex items-center gap-6">
                <Link href="/">
                    <button className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl hover:bg-primary/10 transition-colors text-gray-500 hover:text-primary">
                        <FiArrowLeft size={18} />
                    </button>
                </Link>
                <div>
                    <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Flow Builder</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Draft - Auto Saving Locally</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-100 dark:border-gray-800 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                >
                    <FiDownload /> Export JSON
                </button>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-black shadow-xl shadow-blue-500/20 hover:opacity-90 transition-opacity"
                >
                    <FiSave /> SAVE FLOW
                </button>
                <div className="w-px h-8 bg-gray-100 dark:border-gray-800 mx-2" />
                <button
                    onClick={onTest}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-black hover:opacity-90 transition-opacity"
                >
                    <FiPlay /> TEST PREVIEW
                </button>
            </div>
        </header>
    );
};

export default BuilderHeader;
