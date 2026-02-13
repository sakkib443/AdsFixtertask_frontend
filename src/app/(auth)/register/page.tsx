"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiPhone, FiLayout } from "react-icons/fi";
import { authService } from "@/services/api";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const userData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                phone: data.phone,
                role: "buyer",
            };

            const response = await authService.register(userData);

            if (response.success) {
                toast.success("Account created successfully!");
                router.push("/login");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side Form */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-md w-full mx-auto space-y-8"
                >
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                            <FiLayout size={20} />
                        </div>
                        <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">Flow<span className="text-blue-600">Builder</span></span>
                    </Link>

                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Join Us</h1>
                        <p className="text-gray-500 font-medium mt-2">Start building intelligent conversation flows today.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">First Name</label>
                                <input
                                    type="text"
                                    {...register("firstName", { required: true })}
                                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl outline-none transition-all font-medium text-gray-900"
                                    placeholder="John"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    {...register("lastName", { required: true })}
                                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl outline-none transition-all font-medium text-gray-900"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl outline-none transition-all font-medium text-gray-900"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                {...register("phone", { required: true })}
                                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl outline-none transition-all font-medium text-gray-900"
                                placeholder="+880 1XXX XXXXXX"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", { required: true, minLength: 6 })}
                                    placeholder="••••••••"
                                    className="w-full px-4 pr-12 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl outline-none transition-all font-medium text-gray-900"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isLoading ? "Creating Account..." : (
                                <>Create Free Account <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 font-medium text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 font-black uppercase tracking-widest text-[11px] hover:underline">Sign In</Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side Info */}
            <div className="hidden lg:flex flex-1 bg-gray-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5" />
                <div className="relative z-10 p-12 space-y-12">
                    <div className="space-y-6">
                        <FeatureItem title="Intuitive Design" desc="Drag, connect, and deploy. No complex coding required." />
                        <FeatureItem title="Real-time Preview" desc="Test flows as you build them with instant socket feedback." />
                        <FeatureItem title="Team Collaboration" desc="Invite team members and build flows together in real-time." />
                    </div>
                </div>
            </div>
        </div>
    );
}

const FeatureItem = ({ title, desc }: { title: string, desc: string }) => (
    <div className="flex gap-4">
        <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 mt-1 shrink-0">
            <FiArrowRight size={14} />
        </div>
        <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-widest">{title}</h4>
            <p className="text-gray-500 text-sm mt-1">{desc}</p>
        </div>
    </div>
);
