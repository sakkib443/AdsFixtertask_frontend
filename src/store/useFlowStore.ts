import { create } from 'zustand';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';

export type FlowState = {
    nodes: Node[];
    edges: Edge[];
    selectedNode: Node | null;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (node: Node) => void;
    setSelectedNode: (node: Node | null) => void;
    updateNodeData: (nodeId: string, data: any) => void;
};

const useFlowStore = create<FlowState>((set, get) => ({
    nodes: [
        {
            id: 'node-1',
            type: 'start',
            position: { x: 400, y: 0 },
            data: { label: 'START' },
        },
        {
            id: 'node-2',
            type: 'message',
            position: { x: 340, y: 100 },
            data: {
                label: 'Welcome Message',
                message: 'Hi! Welcome to our Agency. Would you like to see our services? (Type Yes/No)'
            },
        },
        {
            id: 'node-3',
            type: 'input',
            position: { x: 385, y: 220 },
            data: { label: 'User Input' },
        },
        {
            id: 'node-4',
            type: 'condition',
            position: { x: 340, y: 320 },
            data: {
                label: 'Check "Yes"',
                message: 'yes' // Condition value
            },
        },
        {
            id: 'node-5',
            type: 'message',
            position: { x: 150, y: 480 },
            data: {
                label: 'Show Services',
                message: 'Great! We offer: \n1. Chatbot Building\n2. AI Automation\n3. Web Dev'
            },
        },
        {
            id: 'node-6',
            type: 'message',
            position: { x: 550, y: 480 },
            data: {
                label: 'No Problem',
                message: 'No problem! Have a great day. Feel free to contact us anytime.'
            },
        },
    ],
    edges: [
        { id: 'e1-2', source: 'node-1', target: 'node-2' },
        { id: 'e2-3', source: 'node-2', target: 'node-3' },
        { id: 'e3-4', source: 'node-3', target: 'node-4' },
        { id: 'e4-5', source: 'node-4', target: 'node-5', sourceHandle: 'true' },
        { id: 'e4-6', source: 'node-4', target: 'node-6', sourceHandle: 'false' },
    ],
    selectedNode: null,

    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },

    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },

    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },

    setNodes: (nodes: Node[]) => set({ nodes }),
    setEdges: (edges: Edge[]) => set({ edges }),

    addNode: (node: Node) => set({ nodes: [...get().nodes, node] }),

    setSelectedNode: (node: Node | null) => set({ selectedNode: node }),

    updateNodeData: (nodeId: string, data: any) => {
        set({
            nodes: get().nodes.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
            ),
        });
    },
}));

export default useFlowStore;
