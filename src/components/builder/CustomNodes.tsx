import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FiMessageSquare, FiPlay, FiSquare, FiHelpCircle, FiArrowDownCircle } from 'react-icons/fi';

const BaseNode = ({ children, title, icon: Icon, color, selected, type }: any) => (
    <div className={`min-w-[180px] rounded-2xl bg-white dark:bg-gray-900 border-2 transition-all ${selected ? 'border-primary ring-4 ring-primary/10' : 'border-gray-100 dark:border-gray-800'} shadow-xl`}>
        <div className={`px-4 py-2 border-b dark:border-gray-800 flex items-center gap-2 rounded-t-2xl bg-gray-50/50 dark:bg-gray-800/50`}>
            <div className={`p-1.5 rounded-lg ${color} text-white`}>
                <Icon size={14} />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{title}</span>
        </div>
        <div className="p-4">
            {children}
        </div>
    </div>
);

export const StartNode = memo(({ data, selected }: NodeProps) => (
    <BaseNode title="Start" icon={FiPlay} color="bg-green-500" selected={selected}>
        <p className="text-[10px] text-gray-500 font-medium">Triggered when user starts chat</p>
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500 border-2 border-white" />
    </BaseNode>
));

export const MessageNode = memo(({ data, selected }: NodeProps) => (
    <BaseNode title="Send Message" icon={FiMessageSquare} color="bg-blue-500" selected={selected}>
        <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{data.message || 'No message set...'}</p>
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-300 border-2 border-white" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500 border-2 border-white" />
    </BaseNode>
));

export const InputNode = memo(({ data, selected }: NodeProps) => (
    <BaseNode title="Wait for Input" icon={FiArrowDownCircle} color="bg-orange-500" selected={selected}>
        <p className="text-xs text-gray-700 dark:text-gray-300 italic">{data.variable || 'Waiting for user...'}</p>
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-300 border-2 border-white" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-orange-500 border-2 border-white" />
    </BaseNode>
));

export const ConditionNode = memo(({ data, selected }: NodeProps) => (
    <BaseNode title="Condition" icon={FiHelpCircle} color="bg-purple-500" selected={selected}>
        <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mb-2 uppercase">Check: {data.ifValue || '?'}</p>
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-300 border-2 border-white" />
        <div className="flex justify-between -mx-4 px-4 pt-2 mt-2 border-t dark:border-gray-800">
            <div className="relative">
                <span className="text-[9px] font-black text-green-500 uppercase">True</span>
                <Handle type="source" position={Position.Bottom} id="true" className="w-3 h-3 bg-green-500 border-2 border-white !left-2" />
            </div>
            <div className="relative">
                <span className="text-[9px] font-black text-red-500 uppercase">False</span>
                <Handle type="source" position={Position.Bottom} id="false" className="w-3 h-3 bg-red-500 border-2 border-white !left-auto !right-2" />
            </div>
        </div>
    </BaseNode>
));

export const EndNode = memo(({ data, selected }: NodeProps) => (
    <BaseNode title="End" icon={FiSquare} color="bg-red-500" selected={selected}>
        <p className="text-[10px] text-gray-500 font-medium">Conversation ends here</p>
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-red-500 border-2 border-white" />
    </BaseNode>
));

export const nodeTypes = {
    start: StartNode,
    message: MessageNode,
    input: InputNode,
    condition: ConditionNode,
    end: EndNode,
};
