"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSave, FiX, FiLayout, FiArrowLeft, FiPlus, FiTag, FiDollarSign,
    FiLayers, FiImage, FiLoader, FiTrash2, FiMonitor, FiCheck, FiGlobe
} from "react-icons/fi";
import { uiKitService, categoryService } from "@/services/api";

const TYPE_OPTIONS = [
    { value: "dashboard", label: "Dashboard" },
    { value: "mobile-app", label: "Mobile App" },
    { value: "website", label: "Website" },
    { value: "landing-page", label: "Landing Page" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "saas", label: "SaaS" },
    { value: "admin", label: "Admin Panel" },
    { value: "wireframe", label: "Wireframe" },
    { value: "icon-set", label: "Icon Set" },
    { value: "component-library", label: "Component Library" },
    { value: "design-system", label: "Design System" },
    { value: "other", label: "Other" },
];

const SOFTWARE_OPTIONS = [
    { value: "figma", label: "Figma", color: "bg-purple-100 text-purple-700" },
    { value: "sketch", label: "Sketch", color: "bg-amber-100 text-amber-700" },
    { value: "xd", label: "Adobe XD", color: "bg-pink-100 text-pink-700" },
    { value: "photoshop", label: "Photoshop", color: "bg-blue-100 text-blue-700" },
    { value: "illustrator", label: "Illustrator", color: "bg-orange-100 text-orange-700" },
];

const STATUS_OPTIONS = [
    { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-600" },
    { value: "pending", label: "Pending Review", color: "bg-amber-100 text-amber-700" },
    { value: "approved", label: "Approved", color: "bg-blue-100 text-blue-700" },
    { value: "published", label: "Published", color: "bg-emerald-100 text-emerald-700" },
    { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
];

export default function CreateUIUXKitPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState("basic");

    const [formData, setFormData] = useState({
        // Basic Info
        title: "",
        slug: "",
        description: "",
        shortDescription: "",
        // Type & Category
        type: "dashboard",
        category: "",
        software: ["figma"],
        tags: [],
        // Media
        thumbnail: "",
        previewImages: [],
        previewVideo: "",
        livePreviewUrl: "",
        // Main File
        mainFile: { url: "", size: 0, format: "fig" },
        // Specifications
        screens: 0,
        components: 0,
        icons: 0,
        responsive: true,
        darkMode: false,
        // Pricing
        price: 0,
        salePrice: null,
        // Content
        features: [],
        highlights: [],
        whatIncluded: [],
        // Status
        status: "draft",
        isFeatured: false,
        isBestSeller: false,
        version: "1.0",
        // SEO
        seoTitle: "",
        seoDescription: "",
    });

    const [tagInput, setTagInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");
    const [highlightInput, setHighlightInput] = useState("");
    const [includeInput, setIncludeInput] = useState("");
    const [previewImageInput, setPreviewImageInput] = useState("");

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAll();
                if (res.success) setCategories(res.data?.filter(c => c.type === "ui-kit" || c.type === "uikit") || res.data || []);
            } catch { }
        };
        fetchCategories();
    }, []);

    // Fetch existing data for edit
    useEffect(() => {
        if (isEditMode && editId) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const res = await uiKitService.getById(editId);
                    if (res.success && res.data) {
                        const d = res.data;
                        setFormData({
                            title: d.title || "",
                            slug: d.slug || "",
                            description: d.description || "",
                            shortDescription: d.shortDescription || "",
                            type: d.type || "dashboard",
                            category: d.category?._id || d.category || "",
                            software: d.software || ["figma"],
                            tags: d.tags || [],
                            thumbnail: d.thumbnail || "",
                            previewImages: d.previewImages || [],
                            previewVideo: d.previewVideo || "",
                            livePreviewUrl: d.livePreviewUrl || "",
                            mainFile: d.mainFile || { url: "", size: 0, format: "fig" },
                            screens: d.screens || 0,
                            components: d.components || 0,
                            icons: d.icons || 0,
                            responsive: d.responsive !== false,
                            darkMode: d.darkMode || false,
                            price: d.price || 0,
                            salePrice: d.salePrice || null,
                            features: d.features || [],
                            highlights: d.highlights || [],
                            whatIncluded: d.whatIncluded || [],
                            status: d.status || "draft",
                            isFeatured: d.isFeatured || false,
                            isBestSeller: d.isBestSeller || false,
                            version: d.version || "1.0",
                            seoTitle: d.seoTitle || "",
                            seoDescription: d.seoDescription || "",
                        });
                    }
                } catch (error) { toast.error("Failed to fetch data"); }
                finally { setLoading(false); }
            };
            fetchData();
        }
    }, [isEditMode, editId]);

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({ ...formData, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const toggleSoftware = (sw) => {
        const arr = formData.software.includes(sw)
            ? formData.software.filter(s => s !== sw)
            : [...formData.software, sw];
        setFormData({ ...formData, software: arr.length ? arr : ["figma"] });
    };

    const addArrayItem = (field, value, setInput) => {
        if (value.trim() && !formData[field].includes(value.trim())) {
            setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
            setInput("");
        }
    };

    const removeArrayItem = (field, item) => {
        setFormData({ ...formData, [field]: formData[field].filter(i => i !== item) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) { toast.error("Title is required"); return; }
        if (!formData.thumbnail.trim()) { toast.error("Thumbnail is required"); return; }
        if (!formData.mainFile.url) { toast.error("Main file URL is required"); return; }
        if (!formData.category) { toast.error("Category is required"); return; }

        setSaving(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                salePrice: formData.salePrice ? Number(formData.salePrice) : null,
                screens: Number(formData.screens),
                components: Number(formData.components),
                icons: Number(formData.icons),
                mainFile: {
                    ...formData.mainFile,
                    size: Number(formData.mainFile.size)
                }
            };

            if (isEditMode) {
                await uiKitService.update(editId, payload);
                toast.success("UI/UX Kit updated!");
            } else {
                await uiKitService.create(payload);
                toast.success("UI/UX Kit created!");
            }
            router.push("/dashboard/admin/products/ui-kits");
        } catch (error) { toast.error(error.message || "Failed to save"); }
        finally { setSaving(false); }
    };

    const tabs = [
        { id: "basic", label: "Basic Info", icon: FiLayout },
        { id: "media", label: "Media", icon: FiImage },
        { id: "specs", label: "Specifications", icon: FiMonitor },
        { id: "content", label: "Content", icon: FiTag },
        { id: "pricing", label: "Pricing & Status", icon: FiDollarSign },
        { id: "seo", label: "SEO", icon: FiGlobe },
    ];

    const InputLabel = ({ children, required }) => (
        <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
            {children} {required && <span className="text-red-500">*</span>}
        </label>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <FiLoader className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/products/ui-kits" className="btn btn-ghost p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                        <FiArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                            <FiLayers className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isEditMode ? "Edit UI/UX Kit" : "Create UI/UX Kit"}</h1>
                            <p className="text-sm text-gray-500">{isEditMode ? "Update UI/UX kit details" : "Add a new UI/UX kit to the marketplace"}</p>
                        </div>
                    </div>
                </div>
                <button onClick={handleSubmit} disabled={saving} className="btn btn-primary px-6 py-3">
                    {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                    {saving ? "Saving..." : isEditMode ? "Update" : "Create"}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                            ? "bg-primary text-black shadow-lg shadow-primary/20"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Info Tab */}
                {activeTab === "basic" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel required>Title</InputLabel>
                                <input type="text" value={formData.title} onChange={handleTitleChange} className="input w-full" placeholder="e.g., Modern Dashboard UI Kit" required />
                            </div>
                            <div>
                                <InputLabel>URL Slug</InputLabel>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="input w-full font-mono text-sm" />
                            </div>
                        </div>

                        <div>
                            <InputLabel>Short Description</InputLabel>
                            <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="input w-full" placeholder="Brief description (max 300 chars)" maxLength={300} />
                        </div>

                        <div>
                            <InputLabel required>Full Description</InputLabel>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="input w-full min-h-[150px] resize-none" placeholder="Detailed description of the UI/UX kit..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel required>Type</InputLabel>
                                <select name="type" value={formData.type} onChange={handleChange} className="input w-full">
                                    {TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <InputLabel required>Category</InputLabel>
                                <select name="category" value={formData.category} onChange={handleChange} className="input w-full">
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Software Selection */}
                        <div>
                            <InputLabel required>Supported Software</InputLabel>
                            <div className="flex flex-wrap gap-2">
                                {SOFTWARE_OPTIONS.map(sw => (
                                    <button
                                        key={sw.value}
                                        type="button"
                                        onClick={() => toggleSoftware(sw.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${formData.software.includes(sw.value) ? sw.color + " ring-2 ring-offset-2 ring-current" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
                                    >
                                        {formData.software.includes(sw.value) && <FiCheck size={14} />}
                                        {sw.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <InputLabel>Tags</InputLabel>
                            <div className="flex gap-2">
                                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("tags", tagInput, setTagInput))} className="input flex-1" placeholder="Add tag and press Enter" />
                                <button type="button" onClick={() => addArrayItem("tags", tagInput, setTagInput)} className="btn btn-ghost p-3"><FiPlus /></button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold flex items-center gap-2">
                                        {tag}
                                        <button type="button" onClick={() => removeArrayItem("tags", tag)} className="hover:text-red-500"><FiX size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Media Tab */}
                {activeTab === "media" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Media & Files</h2>

                        <div>
                            <InputLabel required>Thumbnail URL</InputLabel>
                            <div className="flex gap-4">
                                <input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="input flex-1" placeholder="https://..." />
                                {formData.thumbnail && <img src={formData.thumbnail} alt="Thumb" className="w-20 h-14 object-cover rounded-lg border" />}
                            </div>
                        </div>

                        <div>
                            <InputLabel>Preview Video URL</InputLabel>
                            <input type="url" name="previewVideo" value={formData.previewVideo} onChange={handleChange} className="input w-full" placeholder="YouTube or Vimeo link" />
                        </div>

                        <div>
                            <InputLabel>Live Preview URL</InputLabel>
                            <input type="url" name="livePreviewUrl" value={formData.livePreviewUrl} onChange={handleChange} className="input w-full" placeholder="https://preview.example.com" />
                        </div>

                        {/* Preview Images */}
                        <div>
                            <InputLabel>Preview Images</InputLabel>
                            <div className="flex gap-2 mb-3">
                                <input type="url" value={previewImageInput} onChange={(e) => setPreviewImageInput(e.target.value)} className="input flex-1" placeholder="Image URL" />
                                <button type="button" onClick={() => addArrayItem("previewImages", previewImageInput, setPreviewImageInput)} className="btn btn-ghost p-3"><FiPlus /></button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {formData.previewImages.map((img, i) => (
                                    <div key={i} className="relative group aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setFormData({ ...formData, previewImages: formData.previewImages.filter((_, idx) => idx !== i) })} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center"><FiX size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main File */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-4">Main Download File</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <InputLabel required>File URL</InputLabel>
                                    <input type="url" value={formData.mainFile.url} onChange={(e) => setFormData({ ...formData, mainFile: { ...formData.mainFile, url: e.target.value } })} className="input w-full" placeholder="https://..." />
                                </div>
                                <div>
                                    <InputLabel>File Size (MB)</InputLabel>
                                    <input type="number" value={formData.mainFile.size} onChange={(e) => setFormData({ ...formData, mainFile: { ...formData.mainFile, size: e.target.value } })} className="input w-full" min="0" />
                                </div>
                                <div>
                                    <InputLabel>Format</InputLabel>
                                    <select value={formData.mainFile.format} onChange={(e) => setFormData({ ...formData, mainFile: { ...formData.mainFile, format: e.target.value } })} className="input w-full">
                                        <option value="fig">.fig (Figma)</option>
                                        <option value="sketch">.sketch</option>
                                        <option value="xd">.xd</option>
                                        <option value="psd">.psd</option>
                                        <option value="ai">.ai</option>
                                        <option value="zip">.zip</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Specifications Tab */}
                {activeTab === "specs" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Specifications</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <InputLabel>Screens</InputLabel>
                                <input type="number" name="screens" value={formData.screens} onChange={handleChange} className="input w-full" min="0" />
                            </div>
                            <div>
                                <InputLabel>Components</InputLabel>
                                <input type="number" name="components" value={formData.components} onChange={handleChange} className="input w-full" min="0" />
                            </div>
                            <div>
                                <InputLabel>Icons</InputLabel>
                                <input type="number" name="icons" value={formData.icons} onChange={handleChange} className="input w-full" min="0" />
                            </div>
                        </div>

                        <div>
                            <InputLabel>Version</InputLabel>
                            <input type="text" name="version" value={formData.version} onChange={handleChange} className="input w-40" placeholder="1.0" />
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="responsive" checked={formData.responsive} onChange={handleChange} className="w-5 h-5 rounded accent-primary" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Responsive Design</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="darkMode" checked={formData.darkMode} onChange={handleChange} className="w-5 h-5 rounded accent-primary" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Dark Mode Included</span>
                            </label>
                        </div>
                    </motion.div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Content Details</h2>

                        {/* Features */}
                        <div>
                            <InputLabel>Features</InputLabel>
                            <div className="flex gap-2 mb-3">
                                <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("features", featureInput, setFeatureInput))} className="input flex-1" placeholder="Add feature" />
                                <button type="button" onClick={() => addArrayItem("features", featureInput, setFeatureInput)} className="btn btn-ghost p-3"><FiPlus /></button>
                            </div>
                            <div className="space-y-2">
                                {formData.features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <FiCheck className="text-emerald-500" />
                                        <span className="flex-1 text-sm">{f}</span>
                                        <button type="button" onClick={() => removeArrayItem("features", f)} className="text-red-500 hover:bg-red-50 p-1 rounded"><FiTrash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Highlights */}
                        <div>
                            <InputLabel>Highlights</InputLabel>
                            <div className="flex gap-2 mb-3">
                                <input type="text" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("highlights", highlightInput, setHighlightInput))} className="input flex-1" placeholder="Add highlight" />
                                <button type="button" onClick={() => addArrayItem("highlights", highlightInput, setHighlightInput)} className="btn btn-ghost p-3"><FiPlus /></button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.highlights.map((h, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center gap-2">
                                        {h}
                                        <button type="button" onClick={() => removeArrayItem("highlights", h)} className="hover:text-red-500"><FiX size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* What's Included */}
                        <div>
                            <InputLabel>What's Included</InputLabel>
                            <div className="flex gap-2 mb-3">
                                <input type="text" value={includeInput} onChange={(e) => setIncludeInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("whatIncluded", includeInput, setIncludeInput))} className="input flex-1" placeholder="Add item" />
                                <button type="button" onClick={() => addArrayItem("whatIncluded", includeInput, setIncludeInput)} className="btn btn-ghost p-3"><FiPlus /></button>
                            </div>
                            <div className="space-y-2">
                                {formData.whatIncluded.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                        <span className="flex-1 text-sm">{item}</span>
                                        <button type="button" onClick={() => removeArrayItem("whatIncluded", item)} className="text-red-500 hover:bg-red-50 p-1 rounded"><FiTrash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Pricing & Status Tab */}
                {activeTab === "pricing" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Pricing & Status</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel required>Regular Price (৳)</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="input w-full pl-10" min="0" required />
                                </div>
                            </div>
                            <div>
                                <InputLabel>Sale Price (৳)</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                                    <input type="number" name="salePrice" value={formData.salePrice || ""} onChange={handleChange} className="input w-full pl-10" min="0" placeholder="Optional" />
                                </div>
                            </div>
                        </div>

                        {formData.salePrice && formData.price > 0 && (
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                <p className="text-emerald-700 dark:text-emerald-400 font-bold">
                                    Discount: {Math.round(((formData.price - formData.salePrice) / formData.price) * 100)}% OFF
                                </p>
                            </div>
                        )}

                        <div>
                            <InputLabel>Status</InputLabel>
                            <div className="flex flex-wrap gap-2">
                                {STATUS_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: opt.value })}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${formData.status === opt.value ? opt.color + " ring-2 ring-offset-2 ring-current" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded accent-primary" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Featured Product</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} className="w-5 h-5 rounded accent-amber-500" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Best Seller</span>
                            </label>
                        </div>
                    </motion.div>
                )}

                {/* SEO Tab */}
                {activeTab === "seo" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">SEO Settings</h2>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                            <p className="text-sm text-blue-700 dark:text-blue-300">💡 If left empty, meta tags will be auto-generated from title and description.</p>
                        </div>

                        <div>
                            <InputLabel>SEO Title</InputLabel>
                            <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="input w-full" placeholder="SEO optimized title (max 60 chars)" maxLength={60} />
                            <p className="text-xs text-gray-400 mt-1">{formData.seoTitle.length}/60</p>
                        </div>

                        <div>
                            <InputLabel>SEO Description</InputLabel>
                            <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={3} className="input w-full resize-none" placeholder="SEO description (max 160 chars)" maxLength={160} />
                            <p className="text-xs text-gray-400 mt-1">{formData.seoDescription.length}/160</p>
                        </div>

                        {/* Preview */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Search Preview</p>
                            <div className="font-medium text-blue-600 text-lg truncate">{formData.seoTitle || formData.title || "UI/UX Kit Title"}</div>
                            <div className="text-sm text-green-600 truncate">{`creativehub.com/ui-kits/${formData.slug || "kit-slug"}`}</div>
                            <div className="text-sm text-gray-600 line-clamp-2">{formData.seoDescription || formData.shortDescription || "Kit description..."}</div>
                        </div>
                    </motion.div>
                )}

                {/* Submit */}
                <div className="flex gap-4 mt-8">
                    <Link href="/dashboard/admin/products/ui-kits" className="btn btn-ghost flex-1 py-4">Cancel</Link>
                    <button type="submit" disabled={saving} className="btn btn-primary flex-1 py-4 text-lg">
                        {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                        {saving ? "Saving..." : isEditMode ? "Update UI/UX Kit" : "Create UI/UX Kit"}
                    </button>
                </div>
            </form>
        </div>
    );
}
