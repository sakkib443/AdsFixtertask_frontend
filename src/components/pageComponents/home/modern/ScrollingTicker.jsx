"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function ScrollingTicker({ direction = "left" }) {
    const { t } = useLanguage();

    const tickerKeys = [
        "templates",
        "fonts",
        "graphicsWord",
        "icons",
        "illustrations",
        "mockups",
        "uiKitsWord",
        "branding"
    ];

    const xRange = direction === "left" ? [0, -1920] : [-1920, 0];

    return (
        <section className="py-6 bg-primary overflow-hidden">
            <div className="relative">
                <motion.div
                    className="flex gap-12 whitespace-nowrap"
                    animate={{ x: xRange }}
                    transition={{
                        duration: 30, // Slowed down for a more premium feel
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {/* Duplicate items for seamless loop */}
                    {[...tickerKeys, ...tickerKeys, ...tickerKeys, ...tickerKeys].map((key, index) => (
                        <div key={index} className="flex items-center gap-12">
                            <span className="text-3xl md:text-5xl font-black text-black font-heading uppercase tracking-tighter">
                                {t(key)}
                            </span>
                            <span className="text-black text-2xl">★</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
