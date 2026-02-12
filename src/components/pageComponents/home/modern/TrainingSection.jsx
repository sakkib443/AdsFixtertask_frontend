"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiPlay, FiStar, FiClock, FiUsers, FiArrowRight } from "react-icons/fi";
import { courseService } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";

const getCategories = (t, language) => [
    { id: "all", label: language === 'bn' ? 'সব কোর্স' : 'All Courses' },
    { id: "graphic", label: t('graphicDesign') },
    { id: "ui", label: t('uxui') },
    { id: "branding", label: t('branding') },
    { id: "freelancing", label: t('freelancing') },
];

export default function TrainingSection() {
    const { t, language } = useLanguage();
    const categories = getCategories(t, language);
    const [courses, setCourses] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseService.getAll({ status: "published" });
                if (response.success && response.data) {
                    const mappedCourses = response.data.slice(0, 6).map((course) => {
                        let category = "graphic";
                        const titleLower = course.title.toLowerCase();
                        if (titleLower.includes("ui") || titleLower.includes("ux")) category = "ui";
                        else if (titleLower.includes("brand") || titleLower.includes("logo")) category = "branding";
                        else if (titleLower.includes("freelanc")) category = "freelancing";

                        return {
                            id: course._id,
                            title: course.title,
                            slug: course.slug || course._id,
                            lessons: course.totalLessons || 0,
                            rating: course.averageRating || 4.8,
                            enroll: course.totalEnrollments || 0,
                            duration: `${Math.round((course.totalDuration || 0) / 60)}h`,
                            category: category,
                            categoryName: course.category?.name || (language === 'bn' ? 'কোর্স' : 'Course'),
                            image: course.thumbnail || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
                            price: course.discountPrice || course.price || 0,
                            level: course.level || "Beginner",
                            instructor: {
                                name: course.instructor?.name || "Instructor",
                                avatar: course.instructor?.avatar
                            }
                        };
                    });
                    setCourses(mappedCourses);
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [t, language]);

    const filteredCourses = activeTab === "all"
        ? courses
        : courses.filter(course => course.category === activeTab);

    return (
        <section className="py-24 bg-[#F9FAFB] dark:bg-gray-950 relative overflow-hidden">
            <div className="container px-6 lg:px-12 max-w-[1240px] mx-auto relative z-10">

                {/* Section Header */}
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
                            {language === 'bn' ? 'ট্রেনিং কোর্স' : 'Training Courses'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
                            {language === 'bn'
                                ? 'আমাদের প্রিমিয়াম ভিডিও কোর্সের মাধ্যমে নতুন দক্ষতা অর্জন করুন। ডিজাইন থেকে ডেভেলপমেন্ট, আপনার দক্ষতাকে আরও বৃদ্ধি করুন।'
                                : 'Learn new skills with our premium video courses. From design to development, master your craft.'}
                        </p>
                    </motion.div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mt-10">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${activeTab === cat.id
                                    ? "bg-[#3D0000] border-[#3D0000] text-white shadow-lg"
                                    : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:border-[#3D0000] hover:text-[#3D0000]"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-2xl  bg-gray-100 dark:bg-gray-800 animate-pulse h-[380px]" />
                        ))
                    ) : (
                        filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group"
                            >
                                <Link href={`/courses/${course.slug}`}>
                                    {/* Image Container */}
                                    <div className="relative  h-[220px] rounded-2xl overflow-hidden mb-5 bg-gray-200 dark:bg-gray-800 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />

                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0  bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
                                                <FiPlay className="w-6 h-6 text-[#3D0000] ml-1" />
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 bg-[#D4980C] text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg">
                                            {course.price > 0 ? `৳${course.price}` : (language === 'bn' ? 'ফ্রি' : 'Free')}
                                        </div>
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-950/90 text-[#3D0000] dark:text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                            {course.level}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="px-1">
                                        <span className="text-[10px]  font-bold text-[#D4980C] uppercase tracking-[0.2em]">
                                            {course.categoryName}
                                        </span>
                                        <h3 className="!text-lg font-bold text-gray-900 dark:text-white mt-1.5 mb-2.5 group-hover:text-[#3D0000] transition-colors line-clamp-2 !leading-snug min-h-[3.2rem]">
                                            {course.title}
                                        </h3>

                                        {/* Meta Tags Row */}
                                        <div className="flex items-center gap-4 text-[10px] font-semibold text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <FiClock className="w-3 h-3" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <FiUsers className="w-3 h-3" />
                                                <span>{course.enroll}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-amber-500">
                                                <FiStar className="w-3 h-3 fill-current" />
                                                <span>{course.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* View All Button */}
                <div className="mt-20 text-center">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-[#3D0000] text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        {language === 'bn' ? 'সব কোর্স দেখুন' : 'View All Courses'}
                        <FiArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
