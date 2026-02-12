import React from 'react';
import { FiMessageSquare, FiPlay, FiSquare, FiHelpCircle, FiArrowDownCircle } from 'react-icons/fi';
import useFlowStore from '@/store/useFlowStore';

const Sidebar = () => {
    const { addNode } = useFlowStore();

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleClick = (type: string) => {
        const id = `${type}-${Date.now()}`;
        const newNode = {
            id,
            type,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: {
                label: type.charAt(0).toUpperCase() + type.slice(1),
                message: type === 'message' ? 'Hello! How can I help?' : undefined
            },
        };
        addNode(newNode);
    };

    return (
        <aside className="w-72 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-6">
            <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Components</h3>
                <div className="grid grid-cols-1 gap-3">
                    <DraggableItem
                        type="start"
                        label="Start Trigger"
                        icon={<FiPlay />}
                        color="bg-green-500"
                        onDragStart={onDragStart}
                        onClick={() => handleClick('start')}
                    />
                    <DraggableItem
                        type="message"
                        label="Send Message"
                        icon={<FiMessageSquare />}
                        color="bg-blue-500"
                        onDragStart={onDragStart}
                        onClick={() => handleClick('message')}
                    />
                    <DraggableItem
                        type="input"
                        label="Wait for Input"
                        icon={<FiArrowDownCircle />}
                        color="bg-orange-500"
                        onDragStart={onDragStart}
                        onClick={() => handleClick('input')}
                    />
                    <DraggableItem
                        type="condition"
                        label="Check Condition"
                        icon={<FiHelpCircle />}
                        color="bg-purple-500"
                        onDragStart={onDragStart}
                        onClick={() => handleClick('condition')}
                    />
                    <DraggableItem
                        type="end"
                        label="End Flow"
                        icon={<FiSquare />}
                        color="bg-red-500"
                        onDragStart={onDragStart}
                        onClick={() => handleClick('end')}
                    />
                </div>
            </div>

            <div className="mt-auto p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50">
                <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed font-black uppercase tracking-widest">
                    Quick Tip
                </p>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1 font-medium">
                    You can either **Drag** these onto the canvas or simply **Click** to add them instantly.
                </p>
            </div>
        </aside>
    );
};

const DraggableItem = ({ type, label, icon, color, onDragStart, onClick }: any) => (
    <div
        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 cursor-grab hover:border-blue-600/50 hover:bg-white dark:hover:bg-gray-900 transition-all group shadow-sm active:cursor-grabbing hover:shadow-md"
        onDragStart={(event) => onDragStart(event, type)}
        onClick={onClick}
        draggable
    >
        <div className={`p-2 rounded-lg ${color} text-white shadow-lg shadow-${color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</span>
    </div>
);

export default Sidebar;
