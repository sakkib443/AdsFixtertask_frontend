"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ReactFlowProvider } from 'reactflow';
import Sidebar from '@/components/builder/Sidebar';
import ConfigPanel from '@/components/builder/ConfigPanel';
import FlowCanvas from '@/components/builder/FlowCanvas';
import BuilderHeader from '@/components/builder/BuilderHeader';
import ChatPreview from '@/components/builder/ChatPreview';
import { flowService } from '@/services/api';
import useFlowStore from '@/store/useFlowStore';
import toast from 'react-hot-toast';

function BuilderContent() {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [flowId, setFlowId] = useState<string | null>(null);
    const [flowName, setFlowName] = useState('Untitled Flow');
    const searchParams = useSearchParams();
    const { nodes, edges, setNodes, setEdges } = useFlowStore();

    // Load flow from backend if flowId exists in URL
    useEffect(() => {
        const id = searchParams.get('flowId');
        if (id) {
            setFlowId(id);
            loadFlow(id);
        }
    }, [searchParams]);

    const loadFlow = async (id: string) => {
        try {
            const res = await flowService.getById(id);
            if (res.success && res.data) {
                setFlowName(res.data.name || 'Untitled Flow');
                if (res.data.nodes && res.data.nodes.length > 0) {
                    setNodes(res.data.nodes);
                }
                if (res.data.edges) {
                    setEdges(res.data.edges);
                }
                toast.success('Flow loaded!');
            }
        } catch (e) {
            console.error('Failed to load flow', e);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (flowId) {
                // Update existing flow
                await flowService.update(flowId, { nodes, edges, name: flowName });
                toast.success('Flow saved successfully!');
            } else {
                // Create new flow
                const res = await flowService.create({ name: flowName, nodes, edges, isActive: false });
                if (res.success && res.data?._id) {
                    setFlowId(res.data._id);
                    // Update URL without reload
                    window.history.replaceState(null, '', `/builder?flowId=${res.data._id}`);
                    toast.success('Flow created & saved!');
                }
            }
        } catch (e) {
            toast.error('Failed to save flow');
        } finally {
            setIsSaving(false);
        }
    };

    // Auto Save every 30 seconds
    useEffect(() => {
        if (!flowId) return;
        const interval = setInterval(() => {
            flowService.update(flowId, { nodes, edges }).catch(() => { });
        }, 30000);
        return () => clearInterval(interval);
    }, [flowId, nodes, edges]);

    // Also save to localStorage as backup
    useEffect(() => {
        try {
            localStorage.setItem('flow_backup', JSON.stringify({ nodes, edges, name: flowName, flowId }));
        } catch (e) { }
    }, [nodes, edges, flowName, flowId]);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <BuilderHeader
                onTest={() => setIsPreviewOpen(true)}
                onSave={handleSave}
                isSaving={isSaving}
                flowName={flowName}
                setFlowName={setFlowName}
                flowId={flowId}
            />
            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <ReactFlowProvider>
                    <FlowCanvas />
                </ReactFlowProvider>
                <ConfigPanel />
            </div>
            <ChatPreview isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
        </div>
    );
}

export default function BuilderPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600" /></div>}>
            <BuilderContent />
        </Suspense>
    );
}
