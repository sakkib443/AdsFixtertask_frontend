import React, { useCallback, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Panel,
    ReactFlowProvider,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useFlowStore from '@/store/useFlowStore';
import { nodeTypes } from './CustomNodes';

const FlowCanvas = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNode, addNode } = useFlowStore();
    const { screenToFlowPosition } = useReactFlow();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: `node-${Date.now()}`,
                type,
                position,
                data: { label: `${type} node`, message: '', ifValue: '', variable: '' },
            };

            addNode(newNode);
        },
        [screenToFlowPosition, addNode],
    );

    return (
        <div className="flex-1 relative" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={(_, node) => setSelectedNode(node)}
                onPaneClick={() => setSelectedNode(null)}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background color="#cbd5e1" gap={20} />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default FlowCanvas;
