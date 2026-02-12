"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiShoppingCart, FiArrowUpRight, FiSearch } from "react-icons/fi";
import { graphicsService, uiKitService, cartService } from "@/services/api";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

const getCategories = (t) => [
    { id: "all", label: t('all') },
    { id: "ui-kits", label: t('uxui') },
    { id: "branding", label: t('branding') },
    { id: "presentation", label: t('presentations') },
    { id: "logo", label: t('logo') },
    { id: "print", label: t('print') },
];

export default function DesignSection() {
    const { t, language } = useLanguage();
    const categories = getCategories(t);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [graphicsRes, uiKitsRes] = await Promise.all([
                    graphicsService.getAll("?limit=6"),
                    uiKitService.getAll("?limit=6")
                ]);

                let allProducts = [];
                if (graphicsRes.success && graphicsRes.data) {
                    allProducts = [...allProducts, ...graphicsRes.data.map(p => ({ ...p, type: 'graphic' }))];
                }
                if (uiKitsRes.success && uiKitsRes.data) {
                    allProducts = [...allProducts, ...uiKitsRes.data.map(p => ({ ...p, type: 'ui-kit' }))];
                }

                setProducts(allProducts.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch design products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const res = await cartService.addToCart({
                productId: product._id,
                productType: product.type || 'graphic',
                price: product.price,
                title: product.title,
                image: product.thumbnail
            });
            if (res.success) {
                toast.success('Added to cart!');
            }
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    const filteredProducts = products.filter(product => {
        if (activeTab === "all") return true;
        if (activeTab === "ui-kits") return product.type === "ui-kit";
        const categoryName = typeof product.category === 'object'
            ? (product.category?.name || product.category?.slug || '')
            : (product.category || '');
        return categoryName.toLowerCase().includes(activeTab.toLowerCase());
    });

    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
            <div className="container px-6 lg:px-12 max-w-[1240px] mx-auto">

                {/* Section Header - Styled like provided image */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2
                            className="text-5xl md:text-6xl font-bold text-[#3D0000] dark:text-white mb-4"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            {language === 'bn' ? 'ডিজিটাল স্টোর' : 'Digital Assets'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
                            {language === 'bn'
                                ? 'আপনার প্রজেক্টের জন্য সেরা মানের গ্রাফিক ডিজাইন এবং UI কিটস ডাউনলোড করুন আমাদের ডিজিটাল মার্কেটপ্লেস থেকে।'
                                : 'Explore our curated marketplace for the highest quality design assets and UI kits for your projects.'}
                        </p>
                    </motion.div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mt-10">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${activeTab === cat.id
                                    ? "bg-secondary dark:bg-primary border-secondary dark:border-primary text-white dark:text-black shadow-lg"
                                    : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:border-primary hover:text-primary"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gray-100 dark:bg-gray-800 h-[380px] rounded-2xl animate-pulse" />
                            ))
                        ) : (
                            filteredProducts.map((product, index) => {
                                const detailsUrl = product.type === 'ui-kit'
                                    ? `/ui-kits/${product.slug || product._id}`
                                    : `/graphics/${product.slug || product._id}`;

                                const categoryName = typeof product.category === 'object'
                                    ? (product.category?.name || '')
                                    : (product.category || '');

                                return (
                                    <motion.div
                                        key={product._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Link href={detailsUrl} className="group block">
                                            {/* Image Container */}
                                            <div className="relative h-[220px] rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                                                <img
                                                    src={product.thumbnail || product.image || "/placeholder-design.jpg"}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />

                                                {/* Category Badge */}
                                                <div className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${product.type === "ui-kit"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-pink-500 text-white"
                                                    }`}>
                                                    {product.type === "ui-kit" ? "UX/UI" : "Graphics"}
                                                </div>

                                                {/* Price Badge */}
                                                <div className="absolute top-4 right-4 bg-primary text-black px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                                                    ৳{product.price || "0"}
                                                </div>

                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                    <button
                                                        onClick={(e) => handleAddToCart(e, product)}
                                                        className="w-14 h-14 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all shadow-xl"
                                                    >
                                                        <FiShoppingCart className="w-6 h-6 text-gray-900" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div>
                                                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                                    {categoryName || (product.type === 'ui-kit' ? 'UI KIT' : 'Graphics')}
                                                </span>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                    {product.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span>{product.sales || 0} {language === 'bn' ? 'ডাউনলোড' : 'Downloads'}</span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="text-yellow-500">★</span>
                                                        {product.rating || "4.5"}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>

                {/* View More CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <Link href="/graphics" className="inline-flex items-center gap-4 px-10 py-5 bg-secondary dark:bg-white text-white dark:text-black rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all group">
                        Browse all assets
                        <FiSearch className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
