"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiSave, FiDownload, FiType, FiBold, FiItalic, FiAlignCenter, FiAlignLeft, FiAlignRight } from "react-icons/fi";
import { spreadsheetService } from "@/services/api";
import Link from "next/link";
import toast from "react-hot-toast";
import SpreadsheetGrid from "@/components/spreadsheet/SpreadsheetGrid";

export default function SpreadsheetDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [spreadsheet, setSpreadsheet] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (id) fetchSpreadsheet();
    }, [id]);

    const fetchSpreadsheet = async () => {
        try {
            const response = await spreadsheetService.getById(id as string);
            if (response.success) {
                setSpreadsheet(response.data);
            }
        } catch (error) {
            toast.error("Failed to load spreadsheet");
            router.push("/dashboard/admin/spreadsheet");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (updatedData: any) => {
        setIsSaving(true);
        try {
            const response = await spreadsheetService.update(id as string, { data: updatedData });
            if (response.success) {
                toast.success("Saved successfully");
            }
        } catch (error) {
            toast.error("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-10rem)] flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/spreadsheet" className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight leading-none uppercase">{spreadsheet?.name}</h1>
                        <p className="text-[9px] font-normal uppercase tracking-widest text-green-600 mt-1">Spreadsheet Editor</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => (window as any).dispatchSave?.()}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all shadow-md disabled:opacity-50"
                    >
                        <FiSave />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <SpreadsheetGrid
                    initialData={spreadsheet?.data || []}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
}
