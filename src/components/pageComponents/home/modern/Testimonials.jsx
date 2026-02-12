"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const testimonialsData = [
    {
        id: 1,
        quote: "The design quality here is absolutely top-notch. I've saved countless hours on my freelance projects by using these premium templates. My clients are always impressed with the professional results. Highly recommended for any serious designer!",
        author: "Mohammad Rakib",
        title: "Senior Brand Designer",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop",
        facebook: "#",
        linkedin: "#"
    },
    {
        id: 2,
        quote: "This platform is a game-changer for UI/UX designers in Bangladesh. The UI kits are comprehensive and modern, helping me build high-quality web applications in record time. The support team is also incredibly helpful.",
        author: "Nusrat Jahan",
        title: "Product Designer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        facebook: "#",
        linkedin: "#"
    },
    {
        id: 3,
        quote: "Success in design comes from understanding the core fundamentals. These training courses provide exactly that. The depth of knowledge and real-world examples shared are priceless. It's the best investment I've made for my career.",
        author: "Tanvir Ahmed",
        title: "UX Researcher",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        facebook: "#",
        linkedin: "#"
    },
    {
        id: 4,
        quote: "I've tried many marketplaces, but the attention to detail here is on another level. Each asset feels premium and carefully crafted. It has significantly elevated the quality of my design portfolio and agency work.",
        author: "Rakibul Hasan",
        title: "Art Director",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        facebook: "#",
        linkedin: "#"
    },
    {
        id: 5,
        quote: "The design quality here is absolutely top-notch. I've saved countless hours on my freelance projects by using these premium templates. My clients are always impressed with the professional results. Highly recommended for any serious designer!",
        author: "Zayed Uddin",
        title: "Designer & Trainer",
        image: "https://i.ibb.co.com/Xk9H59Y/Whats-App-Image-2025-01-23-at-10-39-35-PM.jpg",
        facebook: "#",
        linkedin: "#"
    },
    {
        id: 6,
        quote: "As a developer, I often struggle with design. This platform's UI kits and design assets allow me to build beautiful interfaces without needing a dedicated designer. It's an essential tool for any solo founder or developer.",
        author: "Sajib Hossain",
        title: "Full Stack Developer",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
        facebook: "#",
        linkedin: "#"
    },
    {
        id: 7,
        quote: "Social media marketing requires constant new content. The post templates and graphic assets here make it so easy to maintain a professional presence. My engagement rates have doubled since I started using them.",
        author: "Adnan Sami",
        title: "Social Media Manager",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        facebook: "#",
        linkedin: "#"
    },
    {
        id: 8,
        quote: "The training modules are very well-structured. Even as someone with years of experience, I found the advanced techniques taught here to be revolutionary for my workflow. Truly a world-class learning platform.",
        author: "Ishrat Jahan",
        title: "Creative Lead",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        facebook: "#",
        linkedin: "#"
    },
    {
        id: 9,
        quote: "I am extremely satisfied with the customer service and the quality of the digital products. It's rare to find such high-quality assets at such reasonable prices. This is my go-to place for all my design needs.",
        author: "Ariful Islam",
        title: "Freelance Designer",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        facebook: "#",
        linkedin: "#"
    }
];

export default function Testimonials() {
    const { language } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(4); // Default to middle item (Zayed Uddin)

    return (
        <section className="py-16 bg-[#D1D1D1] dark:bg-gray-950 overflow-hidden relative">
            <div className="container px-6 lg:px-12 max-w-[1200px] mx-auto relative z-10">

                {/* Section Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2
                            className="text-4xl md:text-5xl font-bold text-[#3D0000] dark:text-white mb-2"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            {language === 'bn' ? 'আমার সম্পর্কে মানুষের মতামত' : 'Peoples Say About me'}
                        </h2>
                    </motion.div>
                </div>

                {/* Avatar Selection Row */}
                <div className="flex justify-center items-center mb-16 px-4">
                    <div className="flex -space-x-3 md:-space-x-4 items-center">
                        {testimonialsData.map((person, index) => (
                            <button
                                key={person.id}
                                onClick={() => setActiveIndex(index)}
                                className={`relative transition-all duration-300 transform ${activeIndex === index
                                        ? "z-30 scale-[1.3] md:scale-[1.6]"
                                        : "z-10 opacity-70 hover:opacity-100 hover:z-20 hover:scale-110"
                                    }`}
                            >
                                <div className={`w-12 h-12 md:w-24 md:h-24 rounded-full border-[3px] md:border-[5px] overflow-hidden bg-[#1A0000] shadow-2xl ${activeIndex === index ? "border-white" : "border-white/30"
                                    }`}>
                                    <img
                                        src={person.image}
                                        alt={person.author}
                                        className={`w-full h-full object-cover transition-all duration-300 ${activeIndex === index ? "grayscale-0" : "grayscale-[50%]"
                                            }`}
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Testimonial Card */}
                <div className="max-w-4xl mx-auto relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col md:flex-row items-stretch"
                        >
                            {/* Card Body */}
                            <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] shadow-lg flex-1 flex flex-col md:flex-row items-center p-5 md:p-0 relative">

                                {/* Image Overlay for Desktop */}
                                <div className="hidden md:block absolute -left-16 lg:-left-20 top-1/2 -translate-y-1/2">
                                    <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full border-[8px] border-[#1A0000] overflow-hidden shadow-xl">
                                        <img
                                            src={testimonialsData[activeIndex].image}
                                            alt={testimonialsData[activeIndex].author}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="md:pl-40 lg:pl-44 pr-6 md:pr-10 py-8 md:py-12 flex-1">
                                    <FaQuoteLeft className="text-[#3D0000] text-4xl mb-4 opacity-80" />

                                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-6 italic">
                                        "{testimonialsData[activeIndex].quote}"
                                    </p>

                                    <div className="flex flex-col">
                                        <h4 className="text-xl font-bold text-[#3D0000] dark:text-white">
                                            {testimonialsData[activeIndex].author}
                                        </h4>
                                        <p className="text-gray-500 text-sm font-medium">
                                            {testimonialsData[activeIndex].title}
                                        </p>
                                    </div>
                                </div>

                                {/* Golden Sidebar */}
                                <div className="w-full md:w-12 bg-[#D4980C] py-4 md:py-8 flex flex-row md:flex-col items-center justify-center gap-4 rounded-b-[1.5rem] md:rounded-r-[1.5rem] md:rounded-bl-none">
                                    <a href={testimonialsData[activeIndex].facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#D4980C] hover:scale-110 transition-transform shadow-md">
                                        <FiFacebook size={16} />
                                    </a>
                                    <a href={testimonialsData[activeIndex].linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#D4980C] hover:scale-110 transition-transform shadow-md">
                                        <FiLinkedin size={16} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonialsData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? "w-6 bg-[#3D0000]" : "w-2 bg-gray-400"
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3D0000]/5 blur-3xl rounded-full" />
        </section>
    );
}
