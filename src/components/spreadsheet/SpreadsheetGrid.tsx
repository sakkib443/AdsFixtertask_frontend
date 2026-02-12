"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    FiBold, FiItalic, FiAlignLeft, FiAlignCenter, FiAlignRight, FiType,
    FiPlus, FiTrash2, FiArrowUp, FiArrowDown, FiDownload, FiSave,
    FiChevronDown, FiGrid
} from 'react-icons/fi';

const getColName = (idx: number) => String.fromCharCode(65 + idx);
const colIndex = (col: string) => col.charCodeAt(0) - 65;

interface CellData {
    row: number;
    col: string;
    value: string;
    formula?: string;
    style?: {
        bold?: boolean;
        italic?: boolean;
        textAlign?: string;
        bgColor?: string;
        merged?: boolean;
        mergeParent?: string;
        mergeSpan?: { rows: number; cols: number };
    };
}

interface SheetData {
    name: string;
    cells: CellData[];
    rows: number;
    cols: number;
}

const COLORS = ['#ffffff', '#fef3c7', '#dcfce7', '#dbeafe', '#fce7f3', '#ede9fe', '#fed7d7', '#e2e8f0', '#d1fae5', '#fef08a'];

export default function SpreadsheetGrid({ initialData, onSave }: { initialData: any[], onSave: (data: any) => void }) {
    const [sheets, setSheets] = useState<SheetData[]>([
        { name: 'Sheet 1', cells: initialData || [], rows: 30, cols: 26 },
    ]);
    const [activeSheet, setActiveSheet] = useState(0);
    const [selectedCell, setSelectedCell] = useState<{ row: number, col: string } | null>(null);
    const [selectedRange, setSelectedRange] = useState<{ start: { row: number, col: string }, end: { row: number, col: string } } | null>(null);
    const [editingCell, setEditingCell] = useState<{ row: number, col: string } | null>(null);
    const [editValue, setEditValue] = useState("");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, type: 'row' | 'col', index: number } | null>(null);

    const sheet = sheets[activeSheet];
    const { cells: data, rows: ROWS, cols: COLS } = sheet;

    // Save to global and localStorage
    useEffect(() => {
        (window as any).dispatchSave = () => onSave(sheets);
        try { localStorage.setItem('spreadsheet_backup', JSON.stringify(sheets)); } catch (e) { }
        return () => { delete (window as any).dispatchSave; };
    }, [sheets, onSave]);

    const setData = (newCells: CellData[]) => {
        setSheets(prev => prev.map((s, i) => i === activeSheet ? { ...s, cells: newCells } : s));
    };

    const getCellData = (row: number, col: string): CellData =>
        data.find(c => c.row === row && c.col === col) || { row, col, value: "", style: {} };

    const updateCell = (row: number, col: string, updates: Partial<CellData>) => {
        setData((() => {
            const index = data.findIndex(c => c.row === row && c.col === col);
            if (index > -1) {
                const newData = [...data];
                newData[index] = { ...newData[index], ...updates };
                return newData;
            } else {
                return [...data, { row, col, value: "", style: {}, ...updates }];
            }
        })());
    };

    const evaluateFormula = (formula: string): string => {
        if (!formula.startsWith('=')) return formula;
        try {
            const raw = formula.substring(1).toUpperCase();
            if (raw.startsWith('SUM(')) {
                const range = raw.match(/SUM\((.+)\)/)?.[1];
                if (range?.includes(':')) {
                    const [start, end] = range.split(':');
                    const sC = start.match(/[A-Z]+/)?.[0] || "";
                    const sR = parseInt(start.match(/\d+/)?.[0] || "0");
                    const eC = end.match(/[A-Z]+/)?.[0] || "";
                    const eR = parseInt(end.match(/\d+/)?.[0] || "0");
                    let total = 0;
                    data.forEach(c => {
                        if (c.col >= sC && c.col <= eC && c.row >= sR && c.row <= eR) {
                            const val = parseFloat(c.value);
                            if (!isNaN(val)) total += val;
                        }
                    });
                    return total.toString();
                }
            }
            if (raw.startsWith('AVG(') || raw.startsWith('AVERAGE(')) {
                const range = raw.match(/(?:AVG|AVERAGE)\((.+)\)/)?.[1];
                if (range?.includes(':')) {
                    const [start, end] = range.split(':');
                    const sC = start.match(/[A-Z]+/)?.[0] || "";
                    const sR = parseInt(start.match(/\d+/)?.[0] || "0");
                    const eC = end.match(/[A-Z]+/)?.[0] || "";
                    const eR = parseInt(end.match(/\d+/)?.[0] || "0");
                    let total = 0, count = 0;
                    data.forEach(c => {
                        if (c.col >= sC && c.col <= eC && c.row >= sR && c.row <= eR) {
                            const val = parseFloat(c.value);
                            if (!isNaN(val)) { total += val; count++; }
                        }
                    });
                    return count > 0 ? (total / count).toFixed(2) : "0";
                }
            }
            if (raw.startsWith('COUNT(')) {
                const range = raw.match(/COUNT\((.+)\)/)?.[1];
                if (range?.includes(':')) {
                    const [start, end] = range.split(':');
                    const sC = start.match(/[A-Z]+/)?.[0] || "";
                    const sR = parseInt(start.match(/\d+/)?.[0] || "0");
                    const eC = end.match(/[A-Z]+/)?.[0] || "";
                    const eR = parseInt(end.match(/\d+/)?.[0] || "0");
                    let count = 0;
                    data.forEach(c => {
                        if (c.col >= sC && c.col <= eC && c.row >= sR && c.row <= eR && c.value) count++;
                    });
                    return count.toString();
                }
            }
            if (raw.startsWith('MAX(')) {
                const range = raw.match(/MAX\((.+)\)/)?.[1];
                if (range?.includes(':')) {
                    const [start, end] = range.split(':');
                    const sC = start.match(/[A-Z]+/)?.[0] || "";
                    const sR = parseInt(start.match(/\d+/)?.[0] || "0");
                    const eC = end.match(/[A-Z]+/)?.[0] || "";
                    const eR = parseInt(end.match(/\d+/)?.[0] || "0");
                    let max = -Infinity;
                    data.forEach(c => {
                        if (c.col >= sC && c.col <= eC && c.row >= sR && c.row <= eR) {
                            const val = parseFloat(c.value);
                            if (!isNaN(val) && val > max) max = val;
                        }
                    });
                    return max === -Infinity ? "0" : max.toString();
                }
            }
            if (raw.startsWith('MIN(')) {
                const range = raw.match(/MIN\((.+)\)/)?.[1];
                if (range?.includes(':')) {
                    const [start, end] = range.split(':');
                    const sC = start.match(/[A-Z]+/)?.[0] || "";
                    const sR = parseInt(start.match(/\d+/)?.[0] || "0");
                    const eC = end.match(/[A-Z]+/)?.[0] || "";
                    const eR = parseInt(end.match(/\d+/)?.[0] || "0");
                    let min = Infinity;
                    data.forEach(c => {
                        if (c.col >= sC && c.col <= eC && c.row >= sR && c.row <= eR) {
                            const val = parseFloat(c.value);
                            if (!isNaN(val) && val < min) min = val;
                        }
                    });
                    return min === Infinity ? "0" : min.toString();
                }
            }
            // eslint-disable-next-line no-eval
            return eval(raw).toString();
        } catch (e) { return "#ERROR"; }
    };

    const handleCellBlur = () => {
        if (editingCell) {
            let finalValue = editValue;
            let formula = "";
            if (editValue.startsWith('=')) {
                formula = editValue;
                finalValue = evaluateFormula(editValue);
            }
            updateCell(editingCell.row, editingCell.col, { value: finalValue, formula });
            setEditingCell(null);
        }
    };

    const toggleStyle = (styleKey: string) => {
        if (!selectedCell) return;
        const current = getCellData(selectedCell.row, selectedCell.col);
        const newStyle = { ...current.style, [styleKey]: !current.style?.[styleKey as keyof typeof current.style] };
        updateCell(selectedCell.row, selectedCell.col, { style: newStyle as any });
    };

    const applyAlign = (align: string) => {
        if (!selectedCell) return;
        const current = getCellData(selectedCell.row, selectedCell.col);
        const newStyle = { ...current.style, textAlign: align };
        updateCell(selectedCell.row, selectedCell.col, { style: newStyle as any });
    };

    const applyBgColor = (color: string) => {
        if (!selectedCell) return;
        const current = getCellData(selectedCell.row, selectedCell.col);
        const newStyle = { ...current.style, bgColor: color };
        updateCell(selectedCell.row, selectedCell.col, { style: newStyle as any });
        setShowColorPicker(false);
    };

    // Row & Column operations
    const addRow = () => {
        setSheets(prev => prev.map((s, i) => i === activeSheet ? { ...s, rows: s.rows + 1 } : s));
    };

    const deleteRow = (rowNum: number) => {
        setData(data.filter(c => c.row !== rowNum).map(c => c.row > rowNum ? { ...c, row: c.row - 1 } : c));
        setSheets(prev => prev.map((s, i) => i === activeSheet ? { ...s, rows: Math.max(1, s.rows - 1) } : s));
        setContextMenu(null);
    };

    const addCol = () => {
        if (COLS >= 26) return;
        setSheets(prev => prev.map((s, i) => i === activeSheet ? { ...s, cols: s.cols + 1 } : s));
    };

    const deleteCol = (colIdx: number) => {
        const colName = getColName(colIdx);
        setData(data.filter(c => c.col !== colName));
        setSheets(prev => prev.map((s, i) => i === activeSheet ? { ...s, cols: Math.max(1, s.cols - 1) } : s));
        setContextMenu(null);
    };

    // Sorting
    const sortColumn = (colName: string, direction: 'asc' | 'desc') => {
        const colCells = data.filter(c => c.col === colName && c.value);
        const sorted = colCells.sort((a, b) => {
            const aVal = parseFloat(a.value);
            const bVal = parseFloat(b.value);
            if (!isNaN(aVal) && !isNaN(bVal)) {
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return direction === 'asc' ? a.value.localeCompare(b.value) : b.value.localeCompare(a.value);
        });
        const rowMapping: Record<number, string> = {};
        sorted.forEach((cell, idx) => { rowMapping[idx + 1] = cell.value; });

        const newData = data.map(c => {
            if (c.col === colName && rowMapping[c.row] !== undefined) {
                return { ...c, value: rowMapping[c.row] };
            }
            return c;
        });
        // Also add any rows from mapping that don't exist in newData
        Object.entries(rowMapping).forEach(([row, value]) => {
            const r = parseInt(row);
            if (!newData.find(c => c.row === r && c.col === colName)) {
                newData.push({ row: r, col: colName, value, style: {} });
            }
        });
        setData(newData);
        setContextMenu(null);
    };

    // Multi-Sheet
    const addSheet = () => {
        setSheets(prev => [...prev, { name: `Sheet ${prev.length + 1}`, cells: [], rows: 30, cols: 26 }]);
        setActiveSheet(sheets.length);
    };

    const deleteSheet = (idx: number) => {
        if (sheets.length <= 1) return;
        setSheets(prev => prev.filter((_, i) => i !== idx));
        setActiveSheet(Math.max(0, activeSheet - 1));
    };

    // Export to PDF
    const exportPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        let tableHTML = '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">';
        tableHTML += '<tr><th style="background:#e2e8f0;"></th>';
        for (let c = 0; c < COLS; c++) tableHTML += `<th style="background:#e2e8f0;padding:4px 12px;">${getColName(c)}</th>`;
        tableHTML += '</tr>';

        for (let r = 1; r <= ROWS; r++) {
            let hasData = false;
            for (let c = 0; c < COLS; c++) {
                const cell = getCellData(r, getColName(c));
                if (cell.value) hasData = true;
            }
            if (!hasData && r > 20) continue;

            tableHTML += `<tr><td style="background:#f1f5f9;font-weight:bold;text-align:center;padding:4px 8px;">${r}</td>`;
            for (let c = 0; c < COLS; c++) {
                const col = getColName(c);
                const cell = getCellData(r, col);
                const style = cell.style || {};
                const bgColor = style.bgColor || '#fff';
                const fw = style.bold ? 'bold' : 'normal';
                const fs = style.italic ? 'italic' : 'normal';
                const ta = style.textAlign || 'left';
                tableHTML += `<td style="background:${bgColor};font-weight:${fw};font-style:${fs};text-align:${ta};padding:4px 8px;">${cell.value || ''}</td>`;
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</table>';

        printWindow.document.write(`<!DOCTYPE html><html><head><title>${sheet.name} - Export</title></head><body>${tableHTML}<script>window.print();window.close();</script></body></html>`);
        printWindow.document.close();
    };

    const handleContextMenu = (e: React.MouseEvent, type: 'row' | 'col', index: number) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, type, index });
    };

    return (
        <div className="flex flex-col h-full" onClick={() => { setContextMenu(null); setShowColorPicker(false); }}>
            {/* Formatting Bar */}
            <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex-wrap">
                <div className="flex items-center gap-1 px-2 border-r border-gray-200 dark:border-gray-700">
                    <button onClick={() => toggleStyle('bold')} className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${selectedCell && getCellData(selectedCell.row, selectedCell.col).style?.bold ? 'bg-blue-100 text-blue-600' : ''}`}><FiBold /></button>
                    <button onClick={() => toggleStyle('italic')} className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${selectedCell && getCellData(selectedCell.row, selectedCell.col).style?.italic ? 'bg-blue-100 text-blue-600' : ''}`}><FiItalic /></button>
                </div>
                <div className="flex items-center gap-1 px-2 border-r border-gray-200 dark:border-gray-700">
                    <button onClick={() => applyAlign('left')} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><FiAlignLeft /></button>
                    <button onClick={() => applyAlign('center')} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><FiAlignCenter /></button>
                    <button onClick={() => applyAlign('right')} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><FiAlignRight /></button>
                </div>
                {/* Background Color */}
                <div className="relative px-2 border-r border-gray-200 dark:border-gray-700">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowColorPicker(!showColorPicker); }}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                    >
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: selectedCell ? (getCellData(selectedCell.row, selectedCell.col).style?.bgColor || '#fff') : '#fff' }} />
                        <FiChevronDown size={10} />
                    </button>
                    {showColorPicker && (
                        <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border z-50 grid grid-cols-5 gap-1" onClick={e => e.stopPropagation()}>
                            {COLORS.map(c => (
                                <button key={c} onClick={() => applyBgColor(c)} className="w-7 h-7 rounded-lg border-2 border-gray-200 hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    )}
                </div>
                {/* Row/Col Actions */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-200 dark:border-gray-700">
                    <button onClick={addRow} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-[10px] font-bold flex items-center gap-1" title="Add Row"><FiPlus size={12} /> Row</button>
                    <button onClick={addCol} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-[10px] font-bold flex items-center gap-1" title="Add Column"><FiPlus size={12} /> Col</button>
                </div>
                {/* Export */}
                <div className="flex items-center gap-1 px-2">
                    <button onClick={exportPDF} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-[10px] font-bold flex items-center gap-1"><FiDownload size={12} /> PDF</button>
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
            <div className="flex-1 overflow-auto relative">
                <div className="grid" style={{ gridTemplateColumns: `40px repeat(${COLS}, 120px)` }}>
                    {/* Header Row */}
                    <div className="sticky top-0 z-20 h-8 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-[10px] text-gray-400" />
                    {Array.from({ length: COLS }).map((_, i) => (
                        <div
                            key={i}
                            className="sticky top-0 z-20 h-8 bg-gray-100 dark:bg-gray-900 border-b border-r border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-[10px] text-gray-400 uppercase tracking-widest cursor-context-menu"
                            onContextMenu={(e) => handleContextMenu(e, 'col', i)}
                        >
                            {getColName(i)}
                        </div>
                    ))}

                    {/* Data Rows */}
                    {Array.from({ length: ROWS }).map((_, rIdx) => {
                        const row = rIdx + 1;
                        return (
                            <React.Fragment key={row}>
                                <div
                                    className="sticky left-0 z-10 bg-gray-100 dark:bg-gray-900 border-r border-b border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-[10px] text-gray-400 cursor-context-menu"
                                    onContextMenu={(e) => handleContextMenu(e, 'row', row)}
                                >
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
                                                ${isSelected ? 'ring-2 ring-inset ring-blue-500 bg-blue-50/10 z-10' : 'hover:bg-gray-50 dark:hover:bg-gray-900/40'}
                                            `}
                                            style={{
                                                fontWeight: cellData.style?.bold ? 'bold' : 'normal',
                                                fontStyle: cellData.style?.italic ? 'italic' : 'normal',
                                                textAlign: (cellData.style?.textAlign as any) || 'left',
                                                justifyContent: cellData.style?.textAlign === 'center' ? 'center' : cellData.style?.textAlign === 'right' ? 'flex-end' : 'flex-start',
                                                backgroundColor: cellData.style?.bgColor || 'transparent',
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
                                                        if (e.key === 'Escape') setEditingCell(null);
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

            {/* Sheet Tabs */}
            <div className="flex items-center gap-1 p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                {sheets.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveSheet(i)}
                        onDoubleClick={() => {
                            const name = prompt('Rename sheet:', s.name);
                            if (name) setSheets(prev => prev.map((sh, idx) => idx === i ? { ...sh, name } : sh));
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${i === activeSheet
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                            }`}
                    >
                        {s.name}
                        {sheets.length > 1 && i === activeSheet && (
                            <span
                                onClick={(e) => { e.stopPropagation(); deleteSheet(i); }}
                                className="ml-2 text-white/60 hover:text-white cursor-pointer"
                            >✕</span>
                        )}
                    </button>
                ))}
                <button onClick={addSheet} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-400">
                    <FiPlus size={14} />
                </button>
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 min-w-[180px]"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    {contextMenu.type === 'row' ? (
                        <>
                            <button onClick={() => { addRow(); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                <FiPlus size={12} /> Insert Row Below
                            </button>
                            <button onClick={() => deleteRow(contextMenu.index)} className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                <FiTrash2 size={12} /> Delete Row {contextMenu.index}
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => { addCol(); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                <FiPlus size={12} /> Insert Column After
                            </button>
                            <button onClick={() => deleteCol(contextMenu.index)} className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                <FiTrash2 size={12} /> Delete Column {getColName(contextMenu.index)}
                            </button>
                            <hr className="my-1 border-gray-200 dark:border-gray-700" />
                            <button onClick={() => sortColumn(getColName(contextMenu.index), 'asc')} className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                <FiArrowUp size={12} /> Sort A → Z
                            </button>
                            <button onClick={() => sortColumn(getColName(contextMenu.index), 'desc')} className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                <FiArrowDown size={12} /> Sort Z → A
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
