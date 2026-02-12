"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiClock, FiEye } from "react-icons/fi";
import { blogService } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";

export default function BlogSection() {
    const { t, language } = useLanguage();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await blogService.getRecent();
                if (response.success && response.data) {
                    setBlogs(response.data.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-950">
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
                            {language === 'bn' ? 'সাম্প্রতিক ব্লগ' : 'Insights & Articles'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
                            {language === 'bn'
                                ? 'আমাদের টিপস, টিউটোরিয়াল এবং ডিজাইন জগতের সর্বশেষ খবরগুলো জানুন।'
                                : 'Master your craft with our latest design tips, tutorials, and creative industry insights.'}
                        </p>
                    </motion.div>

                    <div className="flex justify-center mt-10">
                        <Link href="/blogs">
                            <motion.button
                                className="group flex items-center gap-4 text-secondary dark:text-white font-black uppercase text-xs tracking-widest hover:text-primary transition-all"
                                whileHover={{ x: 5 }}
                            >
                                Read All News
                                <FiArrowRight />
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="aspect-[4/3] bg-gray-100 dark:bg-gray-900 rounded-[2.5rem] animate-pulse" />
                        ))
                    ) : (
                        blogs.map((blog, index) => (
                            <motion.article
                                key={blog._id}
                                className="group cursor-pointer"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/blogs/${blog.slug}`} className="block">
                                    {/* Thumbnail */}
                                    <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 shadow-sm transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] group-hover:-translate-y-2">
                                        <img
                                            src={blog.thumbnail}
                                            alt={language === 'bn' ? blog.titleBn : blog.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <span className="px-4 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                {new Date(blog.publishedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-2">
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <FiClock className="text-primary" />
                                                {blog.readingTime || 5} Min Read
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="flex items-center gap-1.5">
                                                <FiEye className="text-secondary dark:text-gray-300" />
                                                {blog.totalViews || 0} Views
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-secondary dark:text-white leading-tight uppercase tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                            {language === 'bn' ? (blog.titleBn || blog.title) : blog.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-6">
                                            {language === 'bn' ? (blog.excerptBn || blog.excerpt) : blog.excerpt}
                                        </p>

                                        <div className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                                            Read Article
                                            <FiArrowRight />
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
