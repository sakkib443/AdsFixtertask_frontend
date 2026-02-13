import React from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import useFlowStore from '@/store/useFlowStore';

const ConfigPanel = () => {
    const { selectedNode, setSelectedNode, updateNodeData } = useFlowStore();

    if (!selectedNode) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateNodeData(selectedNode.id, { [name]: value });
    };

    return (
        <aside className="w-80 bg-white dark:bg-gray-950 border-l border-gray-100 dark:border-gray-800 p-6 shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Properties</h3>
                <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <FiX />
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Node Type</label>
                    <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm font-bold text-gray-500 uppercase">
                        {selectedNode.type}
                    </div>
                </div>

                {selectedNode.type === 'message' && (
                    <>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Bot Message</label>
                            <textarea
                                name="message"
                                value={selectedNode.data.message || ''}
                                onChange={handleChange}
                                className="w-full h-32 px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:border-primary outline-none transition-all resize-none"
                                placeholder="Enter message for user..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Image URL (Optional)</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={selectedNode.data.imageUrl || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:border-primary outline-none transition-all"
                                placeholder="https://example.com/image.png"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Link URL (Optional)</label>
                            <input
                                type="text"
                                name="linkUrl"
                                value={selectedNode.data.linkUrl || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:border-primary outline-none transition-all"
                                placeholder="https://example.com"
                            />
                        </div>
                    </>
                )}

                {selectedNode.type === 'condition' && (
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">If User Says...</label>
                        <input
                            type="text"
                            name="ifValue"
                            value={selectedNode.data.ifValue || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:border-primary outline-none transition-all"
                            placeholder="e.g. Yes"
                        />
                    </div>
                )}

                {selectedNode.type === 'input' && (
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Save Response As</label>
                        <input
                            type="text"
                            name="variable"
                            value={selectedNode.data.variable || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:border-primary outline-none transition-all"
                            placeholder="e.g. user_name"
                        />
                    </div>
                )}

                {selectedNode.type === 'delay' && (
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Delay (Seconds)</label>
                        <input
                            type="number"
                            name="delay"
                            value={selectedNode.data.delay || 2}
                            onChange={handleChange}
                            min={1}
                            max={60}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:border-primary outline-none transition-all"
                        />
                    </div>
                )}

                {selectedNode.type === 'api' && (
                    <>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">HTTP Method</label>
                            <select
                                name="method"
                                value={selectedNode.data.method || 'GET'}
                                onChange={handleChange as any}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:border-primary outline-none transition-all"
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">API URL</label>
                            <input
                                type="text"
                                name="url"
                                value={selectedNode.data.url || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:border-primary outline-none transition-all"
                                placeholder="https://api.example.com/data"
                            />
                        </div>
                    </>
                )}

                {selectedNode.type === 'jump' && (
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Jump to Node</label>
                        <select
                            name="targetNodeId"
                            value={selectedNode.data.targetNodeId || ''}
                            onChange={handleChange as any}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm focus:border-primary outline-none transition-all"
                        >
                            <option value="">Select a node...</option>
                            {useFlowStore.getState().nodes
                                .filter(n => n.id !== selectedNode.id)
                                .map(n => (
                                    <option key={n.id} value={n.id}>
                                        {n.data?.label || n.type} ({n.id.slice(-4)})
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-8 border-t dark:border-gray-800">
                <button
                    onClick={() => setSelectedNode(null)}
                    className="w-full py-3 bg-primary text-secondary font-black rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <FiCheck /> DONE
                </button>
            </div>
        </aside>
    );
};

export default ConfigPanel;
