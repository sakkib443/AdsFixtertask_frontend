"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiBold, FiItalic, FiAlignLeft, FiAlignCenter, FiAlignRight, FiType } from 'react-icons/fi';

const ROWS = 50;
const COLS = 26; // A-Z

const getColName = (idx: number) => String.fromCharCode(65 + idx);

export default function SpreadsheetGrid({ initialData, onSave }: { initialData: any[], onSave: (data: any[]) => void }) {
    const [data, setData] = useState<any[]>(initialData);
    const [selectedCell, setSelectedCell] = useState<{ row: number, col: string } | null>(null);
    const [editingCell, setEditingCell] = useState<{ row: number, col: string } | null>(null);
    const [editValue, setEditValue] = useState("");
    const gridRef = useRef<HTMLDivElement>(null);

    // Sync save to global window for toolbar access
    useEffect(() => {
        (window as any).dispatchSave = () => onSave(data);
        return () => { delete (window as any).dispatchSave; };
    }, [data, onSave]);

    const getCellData = (row: number, col: string) => {
        return data.find(c => c.row === row && c.col === col) || { row, col, value: "", style: {} };
    };

    const updateCell = (row: number, col: string, updates: any) => {
        setData(prev => {
            const index = prev.findIndex(c => c.row === row && c.col === col);
            if (index > -1) {
                const newData = [...prev];
                newData[index] = { ...newData[index], ...updates };
                return newData;
            } else {
                return [...prev, { row, col, value: "", style: {}, ...updates }];
            }
        });
    };

    const evaluateFormula = (formula: string, currentData: any[]) => {
        if (!formula.startsWith('=')) return formula;

        try {
            const raw = formula.substring(1).toUpperCase();

            // SUM(A1:A5)
            if (raw.startsWith('SUM(')) {
                const range = raw.match(/SUM\((.+)\)/)?.[1];
                if (range?.includes(':')) {
                    const [start, end] = range.split(':');
                    const startCol = start.match(/[A-Z]+/)?.[0] || "";
                    const startRow = parseInt(start.match(/\d+/)?.[0] || "0");
                    const endCol = end.match(/[A-Z]+/)?.[0] || "";
                    const endRow = parseInt(end.match(/\d+/)?.[0] || "0");

                    let total = 0;
                    currentData.forEach(c => {
                        if (c.col >= startCol && c.col <= endCol && c.row >= startRow && c.row <= endRow) {
                            const val = parseFloat(c.value);
                            if (!isNaN(val)) total += val;
                        }
                    });
                    return total.toString();
                }
            }

            // Basic Math (=10+20)
            return eval(raw).toString();
        } catch (e) {
            return "#ERROR";
        }
    };

    const handleCellBlur = () => {
        if (editingCell) {
            let finalValue = editValue;
            let formula = "";
            if (editValue.startsWith('=')) {
                formula = editValue;
                finalValue = evaluateFormula(editValue, data);
            }
            updateCell(editingCell.row, editingCell.col, { value: finalValue, formula });
            setEditingCell(null);
        }
    };

    const toggleStyle = (styleKey: string) => {
        if (!selectedCell) return;
        const current = getCellData(selectedCell.row, selectedCell.col);
        const newStyle = { ...current.style, [styleKey]: !current.style?.[styleKey] };
        updateCell(selectedCell.row, selectedCell.col, { style: newStyle });
    };

    const applyAlign = (align: string) => {
        if (!selectedCell) return;
        const current = getCellData(selectedCell.row, selectedCell.col);
        const newStyle = { ...current.style, textAlign: align };
        updateCell(selectedCell.row, selectedCell.col, { style: newStyle });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Formatting Bar */}
            <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex items-center gap-1 px-2 border-r border-gray-200 dark:border-gray-700">
                    <button onClick={() => toggleStyle('bold')} className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${selectedCell && getCellData(selectedCell.row, selectedCell.col).style?.bold ? 'bg-blue-100 text-blue-600' : ''}`}><FiBold /></button>
                    <button onClick={() => toggleStyle('italic')} className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${selectedCell && getCellData(selectedCell.row, selectedCell.col).style?.italic ? 'bg-blue-100 text-blue-600' : ''}`}><FiItalic /></button>
                </div>
                <div className="flex items-center gap-1 px-2">
                    <button onClick={() => applyAlign('left')} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><FiAlignLeft /></button>
                    <button onClick={() => applyAlign('center')} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><FiAlignCenter /></button>
                    <button onClick={() => applyAlign('right')} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><FiAlignRight /></button>
                </div>
                <div className="ml-auto px-4 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-gray-400">Cell: {selectedCell ? `${selectedCell.col}${selectedCell.row}` : '--'}</span>
                    <div className="w-px h-4 bg-gray-200 mx-2" />
                    <div className="flex items-center gap-2">
                        <FiType className="text-gray-400" />
                        <input
                            className="bg-transparent text-xs font-medium outline-none w-48"
                            placeholder="Formula or value..."
                            value={selectedCell ? (getCellData(selectedCell.row, selectedCell.col).formula || getCellData(selectedCell.row, selectedCell.col).value) : ""}
                            readOnly
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto relative scrollbar-hide">
                <div
                    className="grid"
                    style={{ gridTemplateColumns: `40px repeat(${COLS}, 120px)` }}
                >
                    {/* Header Row */}
                    <div className="sticky top-0 z-20 h-8 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-[10px] text-gray-400" />
                    {Array.from({ length: COLS }).map((_, i) => (
                        <div key={i} className="sticky top-0 z-20 h-8 bg-gray-100 dark:bg-gray-900 border-b border-r border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                            {getColName(i)}
                        </div>
                    ))}

                    {/* Data Rows */}
                    {Array.from({ length: ROWS }).map((_, rIdx) => {
                        const row = rIdx + 1;
                        return (
                            <React.Fragment key={row}>
                                <div className="sticky left-0 z-10 bg-gray-100 dark:bg-gray-900 border-r border-b border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-[10px] text-gray-400">
                                    {row}
                                </div>
                                {Array.from({ length: COLS }).map((_, cIdx) => {
                                    const col = getColName(cIdx);
                                    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                                    const isEditing = editingCell?.row === row && editingCell?.col === col;
                                    const cellData = getCellData(row, col);

                                    return (
                                        <div
                                            key={`${row}-${col}`}
                                            onClick={() => setSelectedCell({ row, col })}
                                            onDoubleClick={() => {
                                                setEditingCell({ row, col });
                                                setEditValue(cellData.formula || cellData.value);
                                            }}
                                            className={`h-10 border-r border-b border-gray-100 dark:border-gray-700 px-3 flex items-center transition-colors relative group
                                                ${isSelected ? 'ring-2 ring-inset ring-green-500 bg-green-50/10 z-10' : 'hover:bg-gray-50 dark:hover:bg-gray-900/40'}
                                            `}
                                            style={{
                                                fontWeight: cellData.style?.bold ? 'bold' : 'normal',
                                                fontStyle: cellData.style?.italic ? 'italic' : 'normal',
                                                textAlign: cellData.style?.textAlign || 'left',
                                                justifyContent: cellData.style?.textAlign === 'center' ? 'center' : cellData.style?.textAlign === 'right' ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            {isEditing ? (
                                                <input
                                                    autoFocus
                                                    className="absolute inset-x-0 inset-y-0 px-3 bg-white dark:bg-gray-800 outline-none shadow-xl z-20 font-medium"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleCellBlur}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleCellBlur();
                                                    }}
                                                />
                                            ) : (
                                                <span className="truncate text-sm font-medium">
                                                    {cellData.value}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
