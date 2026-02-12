"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function EnquiryCTA() {
    const { t } = useLanguage();

    return (
        <section className="bg-secondary px-6 py-24 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center gap-10"
                >
                    <div className="space-y-4">
                        <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">Ready to start?</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight uppercase">
                            Have a project in mind?<br />
                            <span className="text-white">Let's build it together.</span>
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
                        <Link
                            href="/contact"
                            className="group relative px-12 py-6 bg-primary text-black text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-2xl hover:bg-white transition-all duration-300 min-w-[280px] overflow-hidden"
                        >
                            <span className="relative z-10">Make an Online Enquiry</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>

                        <div className="flex flex-col items-center md:items-start gap-1">
                            <span className="text-white font-bold text-[10px] uppercase tracking-widest">Or call anytime</span>
                            <a
                                href="tel:+8801714117701"
                                className="text-white font-bold text-xl md:text-2xl hover:text-primary transition-colors tracking-tight"
                            >
                                +880 1714 117701
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
