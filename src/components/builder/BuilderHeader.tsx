import React from 'react';
import { FiSave, FiDownload, FiUpload, FiPlay, FiArrowLeft, FiCheck, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import useFlowStore from '@/store/useFlowStore';
import toast from 'react-hot-toast';

interface BuilderHeaderProps {
    onTest: () => void;
    onSave?: () => void;
    isSaving?: boolean;
    flowName?: string;
    setFlowName?: (name: string) => void;
    flowId?: string | null;
}

const BuilderHeader = ({ onTest, onSave, isSaving, flowName, setFlowName, flowId }: BuilderHeaderProps) => {
    const { nodes, edges, setNodes, setEdges } = useFlowStore();

    const handleExport = () => {
        const json = JSON.stringify({ name: flowName || 'Untitled', nodes, edges }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(flowName || 'flow').replace(/\s+/g, '_')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Flow exported as JSON!');
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                if (data.nodes) setNodes(data.nodes);
                if (data.edges) setEdges(data.edges);
                if (data.name && setFlowName) setFlowName(data.name);
                toast.success('Flow imported successfully!');
            } catch (err) {
                toast.error('Invalid JSON file');
            }
        };
        input.click();
    };

    // Validate flow
    const validateFlow = () => {
        const issues: string[] = [];
        const startNodes = nodes.filter(n => n.type === 'start');
        if (startNodes.length === 0) issues.push('No Start node found');
        if (startNodes.length > 1) issues.push('Multiple Start nodes found');

        // Check for disconnected nodes
        const connectedNodeIds = new Set<string>();
        edges.forEach(e => { connectedNodeIds.add(e.source); connectedNodeIds.add(e.target); });
        const disconnected = nodes.filter(n => !connectedNodeIds.has(n.id) && n.type !== 'start');
        if (disconnected.length > 0) issues.push(`${disconnected.length} disconnected node(s)`);

        if (issues.length > 0) {
            toast.error(`Flow Issues:\n${issues.join('\n')}`, { duration: 4000 });
            return false;
        }
        toast.success('✅ Flow is valid!');
        return true;
    };

    return (
        <header className="h-20 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-8 flex items-center justify-between z-20 shadow-sm">
            <div className="flex items-center gap-6">
                <Link href="/dashboard/admin/flows">
                    <button className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-gray-500 hover:text-blue-600">
                        <FiArrowLeft size={18} />
                    </button>
                </Link>
                <div>
                    <input
                        type="text"
                        value={flowName || ''}
                        onChange={(e) => setFlowName?.(e.target.value)}
                        className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none bg-transparent outline-none border-b-2 border-transparent hover:border-gray-200 focus:border-blue-600 transition-all w-48"
                        placeholder="Flow Name"
                    />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {flowId ? `ID: ${flowId.slice(-6)}` : 'New Flow'} · {nodes.length} Nodes · {edges.length} Edges
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={validateFlow}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-green-50 hover:border-green-200 hover:text-green-600 dark:hover:bg-green-900/10 transition-all uppercase tracking-widest"
                >
                    <FiCheck /> Validate
                </button>
                <button
                    onClick={handleImport}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all uppercase tracking-widest"
                >
                    <FiUpload /> Import
                </button>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all uppercase tracking-widest"
                >
                    <FiDownload /> Export
                </button>
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                    {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
                    {isSaving ? 'SAVING...' : 'SAVE'}
                </button>
                <div className="w-px h-8 bg-gray-100 dark:border-gray-800 mx-2" />
                <button
                    onClick={onTest}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black hover:opacity-90 transition-opacity uppercase tracking-widest"
                >
                    <FiPlay /> TEST
                </button>
            </div>
        </header>
    );
};

export default BuilderHeader;
