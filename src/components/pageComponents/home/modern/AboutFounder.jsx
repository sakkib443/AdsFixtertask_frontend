"use client";

import { motion } from "framer-motion";
import { FiAward, FiUsers, FiDownload, FiStar, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutFounder() {
    const { t, language } = useLanguage();

    const stats = [
        { icon: FiAward, value: "14+", labelKey: "yearsExperience" },
        { icon: FiUsers, value: "2K+", labelKey: "happyClients" },
        { icon: FiDownload, value: "10K+", labelKey: "downloads" },
        { icon: FiStar, value: "4.9", labelKey: "avgRating" },
    ];

    return (
        <section className="py-12 lg:py-16 bg-white dark:bg-gray-950 overflow-hidden relative">
            <div className="container px-6 lg:px-12 max-w-[1240px] mx-auto relative z-10">

                {/* Section Header - Consistent Styled Heading */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* Left: Image Container */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative max-w-[450px] mx-auto lg:mx-0">
                            <div className="relative rounded-[2rem] overflow-hidden border-[8px] border-gray-50 dark:border-gray-900 shadow-2xl">
                                <img
                                    src="https://scontent.fdac15-1.fna.fbcdn.net/v/t39.30808-6/482212933_621532430793416_4202417332788175026_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFwKUwTl8qb-DPyztN0PJdz9IOZGyQhpKL0g5kbJCGkose8DrLRPCNBX3W9anqWQ-1caP0kaplORnL7yLTH55pw&_nc_ohc=yQFROrT2KoMQ7kNvwGIPxUz&_nc_oc=AdnTuJZ7gdMtXYchVczxEOcPxWk1gkd-zwb9Ubx4Ojqvh62dQmQQPRvrMdKmekqMiss&_nc_zt=23&_nc_ht=scontent.fdac15-1.fna&_nc_gid=7wwcl-iB3LJnIf5Ih3oKXg&oh=00_AfpuV1s8NV60lwaEC90oj6XxDhjXiYkFacQDczdQEwdgRw&oe=69782C5C"
                                    alt="Zayed Uddin"
                                    className="w-full h-[400px] lg:h-[450px] object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                <div className="absolute bottom-8 left-8">
                                    <p className="text-white font-black text-2xl uppercase tracking-tighter leading-none">{t('heroAbuSayeed')}</p>
                                    <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mt-2">{t('heroDesigner')}</p>
                                </div>
                            </div>

                            <motion.div
                                className="absolute -right-6 top-1/4 bg-secondary dark:bg-primary px-8 py-6 rounded-3xl shadow-2xl"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                            >
                                <p className="text-4xl font-black text-primary dark:text-black leading-none">14+</p>
                                <p className="text-[10px] font-bold text-white/60 dark:text-black/60 uppercase tracking-widest mt-1">Years of<br />Passion</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col justify-center"
                    >
                        {/* Tags & Heading */}
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full">
                                {language === 'bn' ? 'আমার সম্পর্কে' : 'About Me'}
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-[#3D0000] dark:text-white leading-tight mb-4">
                                {language === 'bn' ? 'সৃজনশীলতা এবং উদ্ভাবনের সংমিশ্রণ' : 'Crafting Vision into Reality'}
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 mb-8 text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            <p>
                                {t('aboutFounderDesc1')}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {t('aboutFounderDesc2')}
                            </p>
                        </div>

                        {/* Modern Stats Strip */}
                        <div className="border-y border-gray-100 dark:border-white/10 py-6 mb-8">
                            <div className="flex flex-wrap gap-8 lg:gap-12">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FiAward className="text-primary text-xl" />
                                        <span className="text-3xl font-black text-secondary dark:text-white">14+</span>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Years Experience</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FiUsers className="text-primary text-xl" />
                                        <span className="text-3xl font-black text-secondary dark:text-white">2K+</span>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Happy Clients</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FiDownload className="text-primary text-xl" />
                                        <span className="text-3xl font-black text-secondary dark:text-white">10K+</span>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Downloads</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-6">
                            <Link href="/about">
                                <motion.button
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-[#3D0000] dark:bg-white text-white dark:text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('learnMoreAboutMe')}
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>

                            {/* Signature or Secondary Action could go here */}
                            <div className="hidden lg:block font-handwriting text-2xl text-gray-400 -rotate-2 select-none">
                                Zayed Uddin
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
