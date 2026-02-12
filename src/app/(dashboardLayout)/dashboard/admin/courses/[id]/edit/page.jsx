"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiBook, FiArrowLeft, FiSave, FiLoader, FiPlus, FiTrash2, FiDollarSign,
    FiImage, FiTag, FiGlobe, FiVideo
} from "react-icons/fi";
import { courseService, categoryService } from "@/services/api";

export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState("basic");

    const [formData, setFormData] = useState({
        // Basic Info
        title: "",
        titleBn: "",
        slug: "",
        description: "",
        descriptionBn: "",
        shortDescription: "",
        shortDescriptionBn: "",
        // Media
        thumbnail: "",
        previewVideo: "",
        bannerImage: "",
        // Category & Tags
        category: "",
        tags: [""],
        // Pricing
        price: 0,
        discountPrice: 0,
        currency: "BDT",
        isFree: false,
        // Course Details
        courseType: "recorded",
        level: "beginner",
        language: "bangla",
        // Content Info
        features: [""],
        requirements: [""],
        whatYouWillLearn: [""],
        targetAudience: [""],
        // Status
        status: "draft",
        isFeatured: false,
        isPopular: false,
        // SEO
        metaTitle: "",
        metaDescription: "",
    });

    // Fetch course and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, categoryRes] = await Promise.all([
                    courseService.getById(courseId),
                    categoryService.getAll()
                ]);

                if (courseRes.success && courseRes.data) {
                    const c = courseRes.data;
                    setFormData({
                        title: c.title || "",
                        titleBn: c.titleBn || "",
                        slug: c.slug || "",
                        description: c.description || "",
                        descriptionBn: c.descriptionBn || "",
                        shortDescription: c.shortDescription || "",
                        shortDescriptionBn: c.shortDescriptionBn || "",
                        thumbnail: c.thumbnail || "",
                        previewVideo: c.previewVideo || "",
                        bannerImage: c.bannerImage || "",
                        category: c.category?._id || c.category || "",
                        tags: c.tags?.length ? c.tags : [""],
                        price: c.price || 0,
                        discountPrice: c.discountPrice || 0,
                        currency: c.currency || "BDT",
                        isFree: c.isFree || false,
                        courseType: c.courseType || "recorded",
                        level: c.level || "beginner",
                        language: c.language || "bangla",
                        features: c.features?.length ? c.features : [""],
                        requirements: c.requirements?.length ? c.requirements : [""],
                        whatYouWillLearn: c.whatYouWillLearn?.length ? c.whatYouWillLearn : [""],
                        targetAudience: c.targetAudience?.length ? c.targetAudience : [""],
                        status: c.status || "draft",
                        isFeatured: c.isFeatured || false,
                        isPopular: c.isPopular || false,
                        metaTitle: c.metaTitle || "",
                        metaDescription: c.metaDescription || "",
                    });
                }

                if (categoryRes.success) {
                    setCategories(categoryRes.data?.filter(cat => cat.type === "course") || []);
                }
            } catch (err) {
                console.error("Failed to fetch course:", err);
                toast.error("Failed to load course data");
            } finally {
                setInitialLoading(false);
            }
        };

        if (courseId) fetchData();
    }, [courseId]);

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({ ...formData, title, slug: generateSlug(title) });
    };

    const handleArrayAdd = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ""] });
    };

    const handleArrayChange = (field, index, value) => {
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const handleArrayRemove = (field, index) => {
        const updated = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: updated.length ? updated : [""] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Course title is required");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                tags: formData.tags.filter(t => t.trim()),
                features: formData.features.filter(f => f.trim()),
                requirements: formData.requirements.filter(r => r.trim()),
                whatYouWillLearn: formData.whatYouWillLearn.filter(w => w.trim()),
                targetAudience: formData.targetAudience.filter(t => t.trim()),
                price: Number(formData.price),
                discountPrice: Number(formData.discountPrice) || null,
            };

            await courseService.update(courseId, payload);
            toast.success("Course updated successfully!");
            router.push(`/dashboard/admin/courses/${courseId}`);
        } catch (err) {
            toast.error(err.message || "Failed to update course");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "basic", label: "Basic Info", icon: FiBook },
        { id: "media", label: "Media", icon: FiImage },
        { id: "content", label: "Content", icon: FiTag },
        { id: "pricing", label: "Pricing", icon: FiDollarSign },
        { id: "seo", label: "SEO", icon: FiGlobe },
    ];

    const InputLabel = ({ children, required }) => (
        <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
            {children} {required && <span className="text-red-500">*</span>}
        </label>
    );

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <FiLoader className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/dashboard/admin/courses/${courseId}`} className="btn btn-ghost p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                    <FiArrowLeft size={20} />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <FiBook className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Edit Course</h1>
                        <p className="text-sm text-gray-500">Update course information</p>
                    </div>
                </div>
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
                                <InputLabel required>Title (English)</InputLabel>
                                <input type="text" value={formData.title} onChange={handleTitleChange} className="input" placeholder="e.g., Complete React Masterclass" required />
                            </div>
                            <div>
                                <InputLabel>Title (Bangla)</InputLabel>
                                <input type="text" value={formData.titleBn} onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })} className="input" placeholder="e.g., সম্পূর্ণ রিয়েক্ট মাস্টারক্লাস" />
                            </div>
                        </div>

                        <div>
                            <InputLabel>URL Slug</InputLabel>
                            <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="input font-mono text-sm" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel>Short Description (English)</InputLabel>
                                <input type="text" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="input" placeholder="Brief overview in one line" maxLength={200} />
                            </div>
                            <div>
                                <InputLabel>Short Description (Bangla)</InputLabel>
                                <input type="text" value={formData.shortDescriptionBn} onChange={(e) => setFormData({ ...formData, shortDescriptionBn: e.target.value })} className="input" placeholder="সংক্ষিপ্ত বিবরণ" maxLength={200} />
                            </div>
                        </div>

                        <div>
                            <InputLabel>Full Description (English)</InputLabel>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={5} className="input resize-none" placeholder="Detailed course description..." />
                        </div>

                        <div>
                            <InputLabel>Full Description (Bangla)</InputLabel>
                            <textarea value={formData.descriptionBn} onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })} rows={4} className="input resize-none" placeholder="বিস্তারিত বিবরণ..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <InputLabel required>Category</InputLabel>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input">
                                    <option value="">Select category</option>
                                    {categories.map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <InputLabel>Course Type</InputLabel>
                                <select value={formData.courseType} onChange={(e) => setFormData({ ...formData, courseType: e.target.value })} className="input">
                                    <option value="recorded">Recorded</option>
                                    <option value="online">Live Online</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel>Level</InputLabel>
                                <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="input">
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel>Language</InputLabel>
                                <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="input">
                                    <option value="bangla">Bangla</option>
                                    <option value="english">English</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Media Tab */}
                {activeTab === "media" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Media & Images</h2>

                        <div>
                            <InputLabel required>Thumbnail URL</InputLabel>
                            <div className="flex gap-4">
                                <input type="text" value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} className="input flex-1" placeholder="https://..." />
                                {formData.thumbnail && (
                                    <img src={formData.thumbnail} alt="Preview" className="w-20 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Recommended: 1280x720px (16:9 ratio)</p>
                        </div>

                        <div>
                            <InputLabel>Banner Image URL</InputLabel>
                            <input type="text" value={formData.bannerImage} onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })} className="input" placeholder="https://..." />
                        </div>

                        <div>
                            <InputLabel>Preview Video URL</InputLabel>
                            <div className="relative">
                                <FiVideo className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" value={formData.previewVideo} onChange={(e) => setFormData({ ...formData, previewVideo: e.target.value })} className="input pl-12" placeholder="YouTube or Vimeo link" />
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <InputLabel>Tags</InputLabel>
                                <button type="button" onClick={() => handleArrayAdd("tags")} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"><FiPlus size={14} /> Add Tag</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, i) => (
                                    <div key={i} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full pl-4 pr-2 py-1.5">
                                        <input type="text" value={tag} onChange={(e) => handleArrayChange("tags", i, e.target.value)} className="bg-transparent border-none outline-none text-sm w-24" placeholder="Tag" />
                                        <button type="button" onClick={() => handleArrayRemove("tags", i)} className="p-1 hover:text-red-500"><FiTrash2 size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Course Content</h2>

                        {/* Features */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <InputLabel>Features (What's Included)</InputLabel>
                                <button type="button" onClick={() => handleArrayAdd("features")} className="btn btn-ghost text-sm p-2"><FiPlus /> Add</button>
                            </div>
                            <div className="space-y-2">
                                {formData.features.map((item, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input type="text" value={item} onChange={(e) => handleArrayChange("features", i, e.target.value)} className="input flex-1" placeholder={`Feature ${i + 1}`} />
                                        <button type="button" onClick={() => handleArrayRemove("features", i)} className="btn btn-ghost text-red-500 p-2"><FiTrash2 /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <InputLabel>Requirements</InputLabel>
                                <button type="button" onClick={() => handleArrayAdd("requirements")} className="btn btn-ghost text-sm p-2"><FiPlus /> Add</button>
                            </div>
                            <div className="space-y-2">
                                {formData.requirements.map((req, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input type="text" value={req} onChange={(e) => handleArrayChange("requirements", i, e.target.value)} className="input flex-1" placeholder={`Requirement ${i + 1}`} />
                                        <button type="button" onClick={() => handleArrayRemove("requirements", i)} className="btn btn-ghost text-red-500 p-2"><FiTrash2 /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What You'll Learn */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <InputLabel>What You'll Learn</InputLabel>
                                <button type="button" onClick={() => handleArrayAdd("whatYouWillLearn")} className="btn btn-ghost text-sm p-2"><FiPlus /> Add</button>
                            </div>
                            <div className="space-y-2">
                                {formData.whatYouWillLearn.map((item, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input type="text" value={item} onChange={(e) => handleArrayChange("whatYouWillLearn", i, e.target.value)} className="input flex-1" placeholder={`Learning outcome ${i + 1}`} />
                                        <button type="button" onClick={() => handleArrayRemove("whatYouWillLearn", i)} className="btn btn-ghost text-red-500 p-2"><FiTrash2 /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Target Audience */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <InputLabel>Target Audience</InputLabel>
                                <button type="button" onClick={() => handleArrayAdd("targetAudience")} className="btn btn-ghost text-sm p-2"><FiPlus /> Add</button>
                            </div>
                            <div className="space-y-2">
                                {formData.targetAudience.map((item, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input type="text" value={item} onChange={(e) => handleArrayChange("targetAudience", i, e.target.value)} className="input flex-1" placeholder={`Target audience ${i + 1}`} />
                                        <button type="button" onClick={() => handleArrayRemove("targetAudience", i)} className="btn btn-ghost text-red-500 p-2"><FiTrash2 /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Pricing Tab */}
                {activeTab === "pricing" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Pricing & Status</h2>

                        {/* Free Course Toggle */}
                        <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                            <input
                                type="checkbox"
                                id="isFree"
                                checked={formData.isFree}
                                onChange={(e) => setFormData({ ...formData, isFree: e.target.checked, price: e.target.checked ? 0 : formData.price })}
                                className="w-5 h-5 rounded accent-emerald-500"
                            />
                            <label htmlFor="isFree" className="flex-1">
                                <span className="font-bold text-gray-900 dark:text-white">Free Course</span>
                                <p className="text-sm text-gray-500">Students can enroll without payment</p>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <InputLabel>Currency</InputLabel>
                                <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="input">
                                    <option value="BDT">BDT (৳)</option>
                                    <option value="USD">USD ($)</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel>Regular Price</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{formData.currency === "BDT" ? "৳" : "$"}</span>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="input pl-10"
                                        min="0"
                                        disabled={formData.isFree}
                                    />
                                </div>
                            </div>
                            <div>
                                <InputLabel>Discount Price</InputLabel>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{formData.currency === "BDT" ? "৳" : "$"}</span>
                                    <input
                                        type="number"
                                        value={formData.discountPrice}
                                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                                        className="input pl-10"
                                        min="0"
                                        placeholder="Optional"
                                        disabled={formData.isFree}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel>Publish Status</InputLabel>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>

                        {/* Featured & Popular */}
                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-5 h-5 rounded accent-primary"
                                />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Featured on Homepage</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPopular}
                                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                    className="w-5 h-5 rounded accent-primary"
                                />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Mark as Popular</span>
                            </label>
                        </div>
                    </motion.div>
                )}

                {/* SEO Tab */}
                {activeTab === "seo" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">SEO Settings</h2>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                💡 If left empty, SEO meta tags will be auto-generated from the course title and description.
                            </p>
                        </div>

                        <div>
                            <InputLabel>Meta Title</InputLabel>
                            <input
                                type="text"
                                value={formData.metaTitle}
                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                className="input"
                                placeholder="SEO optimized title (max 60 chars)"
                                maxLength={60}
                            />
                            <p className="text-xs text-gray-400 mt-1">{formData.metaTitle.length}/60 characters</p>
                        </div>

                        <div>
                            <InputLabel>Meta Description</InputLabel>
                            <textarea
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                rows={3}
                                className="input resize-none"
                                placeholder="SEO description for search engines (max 160 chars)"
                                maxLength={160}
                            />
                            <p className="text-xs text-gray-400 mt-1">{formData.metaDescription.length}/160 characters</p>
                        </div>

                        {/* Preview */}
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Search Result Preview</p>
                            <div className="font-medium text-blue-600 dark:text-blue-400 text-lg truncate">
                                {formData.metaTitle || formData.title || "Course Title"}
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400 truncate">
                                {`creativehub.com/courses/${formData.slug || "course-slug"}`}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {formData.metaDescription || formData.shortDescription || "Course description will appear here..."}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-4 mt-8">
                    <Link href={`/dashboard/admin/courses/${courseId}`} className="btn btn-ghost flex-1 py-4">Cancel</Link>
                    <button type="submit" disabled={loading} className="btn btn-primary flex-1 py-4 text-lg">
                        {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                        {loading ? "Updating..." : "Update Course"}
                    </button>
                </div>
            </form>
        </div>
    );
}
