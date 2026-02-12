"use client";

import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import Sidebar from '@/components/builder/Sidebar';
import ConfigPanel from '@/components/builder/ConfigPanel';
import FlowCanvas from '@/components/builder/FlowCanvas';
import BuilderHeader from '@/components/builder/BuilderHeader';
import ChatPreview from '@/components/builder/ChatPreview';

export default function BuilderPage() {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <BuilderHeader onTest={() => setIsPreviewOpen(true)} />
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
