"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiLayout } from "react-icons/fi";
import { setCredentials } from "@/redux/features/authSlice";
import { authService } from "@/services/api";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await authService.login(data);

            if (response.success) {
                dispatch(setCredentials({
                    user: response.data.user,
                    token: response.data.tokens.accessToken,
                }));

                toast.success("Welcome back!");

                const role = response.data.user.role;
                if (role === "admin" || role === "superadmin") {
                    router.push("/dashboard/admin");
                } else {
                    router.push("/dashboard/user");
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed. Try admin@gmail.com / admin@gmail.com");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-950">
            {/* Left Side */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-24">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-md w-full mx-auto space-y-8"
                >
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                            <FiLayout size={20} />
                        </div>
                        <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Flow<span className="text-blue-600">Builder</span></span>
                    </Link>

                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Sign In</h1>
                        <p className="text-gray-500 font-medium mt-2">Access your automated world.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="email"
                                    {...register("email", { required: "Required" })}
                                    placeholder="admin@gmail.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-600/20 rounded-2xl outline-none transition-all font-medium text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", { required: "Required" })}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-600/20 rounded-2xl outline-none transition-all font-medium text-gray-900 dark:text-white"
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
                            {isLoading ? "Authenticating..." : (
                                <>Sign Into Dashboard <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Default Admin: admin@gmail.com / admin@gmail.com
                    </p>
                </motion.div>
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex flex-1 bg-gray-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />

                <div className="relative z-10 text-center space-y-8 p-12">
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="w-24 h-24 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 border-4 border-white/10"
                    >
                        <FiLayout size={40} />
                    </motion.div>
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
                            BUILD <span className="text-blue-500">DYNAMIC</span> <br /> CONVERSATIONS.
                        </h2>
                        <p className="text-gray-400 font-medium text-lg max-w-sm mx-auto">
                            The most powerful visual tool for automated customer experiences.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
