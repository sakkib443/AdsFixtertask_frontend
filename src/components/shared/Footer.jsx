"use client";

import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram, FiGithub, FiLinkedin, FiLayout } from "react-icons/fi";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();

    // Hide footer on builder and dashboard routes
    if (
        pathname?.startsWith('/builder') ||
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/login')
    ) {
        return null;
    }

    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 py-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <FiLayout size={20} />
                            </div>
                            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Flow<span className="text-blue-600">Builder</span></span>
                        </Link>
                        <p className="text-gray-500 font-medium max-w-sm leading-relaxed">
                            Building the future of conversational AI through visual excellence. Our platform empowers designers to create enterprise-grade chatbot flows without writing code.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialIcon icon={<FiTwitter />} href="#" />
                            <SocialIcon icon={<FiGithub />} href="#" />
                            <SocialIcon icon={<FiLinkedin />} href="#" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Product</h4>
                        <ul className="space-y-4">
                            <FooterLink label="Flow Builder" href="/builder" />
                            <FooterLink label="Live Preview" href="/builder" />
                            <FooterLink label="Templates" href="/" />
                            <FooterLink label="Integrations" href="/" />
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Company</h4>
                        <ul className="space-y-4">
                            <FooterLink label="About AdsFixter" href="https://adsfixter.com" />
                            <FooterLink label="Careers" href="#" />
                            <FooterLink label="Privacy Policy" href="#" />
                            <FooterLink label="Terms of Service" href="#" />
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        © {currentYear} AdsFixter LLC. Senior Engineering Assessment.
                    </p>
                    <div className="flex items-center gap-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status: <span className="text-emerald-500">All Systems Nominal</span></p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href }) {
    return (
        <a href={href} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
            {icon}
        </a>
    );
}

function FooterLink({ label, href }) {
    return (
        <li>
            <Link href={href} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors">
                {label}
            </Link>
        </li>
    );
}
