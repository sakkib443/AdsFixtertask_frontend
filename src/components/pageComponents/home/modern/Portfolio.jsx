"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowUpRight, FiDownload, FiShoppingCart } from "react-icons/fi";
import { graphicsService, uiKitService } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";

export default function Portfolio() {
    const { t, language } = useLanguage();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [graphicsRes, uiKitsRes] = await Promise.all([
                    graphicsService.getAll("?limit=6&sort=-sales"),
                    uiKitService.getAll("?limit=6&sort=-sales")
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
                console.error("Failed to fetch popular designs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
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
                            {language === 'bn' ? 'সেরা ডিজাইনসমূহ' : 'Popular Designs'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
                            {language === 'bn'
                                ? 'আমাদের সংগ্রহের সবচেয়ে জনপ্রিয় এবং ট্রেন্ডিং ডিজাইনগুলো দেখে নিন এক নজরে।'
                                : 'Take a look at the most popular and trending designs from our exclusive collections.'}
                        </p>
                    </motion.div>

                    <div className="flex justify-center mt-10">
                        <Link href="/graphics">
                            <motion.button
                                className="group flex items-center gap-3 text-secondary dark:text-white font-black uppercase text-xs tracking-widest hover:text-primary transition-all"
                                whileHover={{ scale: 1.05 }}
                            >
                                <span>{t('viewAll')}</span>
                                <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
                                    <FiArrowUpRight size={20} />
                                </div>
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* Product Gallery Layout */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-[380px] bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, index) => {
                            const detailsUrl = product.type === 'ui-kit'
                                ? `/ui-kits/${product.slug || product._id}`
                                : `/graphics/${product.slug || product._id}`;

                            const categoryName = typeof product.category === 'object'
                                ? (product.category?.name || '')
                                : (product.category || '');

                            return (
                                <motion.div
                                    key={product._id}
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link href={detailsUrl} className="block group">
                                        {/* Image Container - Matching DesignSection */}
                                        <div className="relative h-[220px] rounded-2xl overflow-hidden mb-5 bg-gray-100 dark:bg-gray-800 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                                            <img
                                                src={product.thumbnail || product.image || "/placeholder-design.jpg"}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all shadow-xl">
                                                    <FiShoppingCart className="w-6 h-6 text-gray-900" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-1">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                                                {categoryName || (product.type === 'ui-kit' ? 'UI KIT' : 'Graphics')}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {product.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <FiDownload size={14} />
                                                    <span>{product.sales || 0} {language === 'bn' ? 'ডাউনলোড' : 'Downloads'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-yellow-500">★</span>
                                                    <span>{product.rating || "4.8"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
