"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FiSettings, FiGlobe, FiBell, FiMoon, FiSun, FiMail,
    FiSmartphone, FiShield, FiEye, FiSave, FiCheck
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const { theme, toggleDarkMode } = useTheme();
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        language: "en",
        emailNotifications: true,
        pushNotifications: true,
        courseReminders: true,
        liveClassReminders: true,
        marketingEmails: false,
        profileVisibility: "public",
        showProgress: true,
        showCertificates: true
    });

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Settings saved successfully!");
        setSaving(false);
    };

    const SettingCard = ({ icon: Icon, title, description, children }) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="text-gray-600 dark:text-gray-300" size={22} />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{description}</p>
                    {children}
                </div>
            </div>
        </div>
    );

    const Toggle = ({ enabled, onChange }) => (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                }`}
        >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? "left-7" : "left-1"
                }`} />
        </button>
    );

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
                    <p className="text-gray-500">Manage your preferences and account settings</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {saving ? (
                        <>Saving...</>
                    ) : (
                        <><FiSave size={18} /> Save Changes</>
                    )}
                </button>
            </div>

            <div className="space-y-6">
                {/* Appearance */}
                <SettingCard
                    icon={FiMoon}
                    title="Appearance"
                    description="Customize how the app looks on your device"
                >
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            {theme.darkMode ? <FiMoon size={18} /> : <FiSun size={18} />}
                            <span className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                        </div>
                        <Toggle enabled={theme.darkMode} onChange={toggleDarkMode} />
                    </div>
                </SettingCard>

                {/* Language */}
                <SettingCard
                    icon={FiGlobe}
                    title="Language"
                    description="Choose your preferred language"
                >
                    <select
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="w-full md:w-64 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                    >
                        <option value="en">English</option>
                        <option value="bn">বাংলা (Bangla)</option>
                    </select>
                </SettingCard>

                {/* Notifications */}
                <SettingCard
                    icon={FiBell}
                    title="Notifications"
                    description="Manage how you receive notifications"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <FiMail size={18} className="text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</p>
                                    <p className="text-xs text-gray-400">Receive updates via email</p>
                                </div>
                            </div>
                            <Toggle
                                enabled={settings.emailNotifications}
                                onChange={(v) => setSettings({ ...settings, emailNotifications: v })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <FiSmartphone size={18} className="text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Push Notifications</p>
                                    <p className="text-xs text-gray-400">Receive push notifications</p>
                                </div>
                            </div>
                            <Toggle
                                enabled={settings.pushNotifications}
                                onChange={(v) => setSettings({ ...settings, pushNotifications: v })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <FiCheck size={18} className="text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Course Reminders</p>
                                    <p className="text-xs text-gray-400">Get reminded about enrolled courses</p>
                                </div>
                            </div>
                            <Toggle
                                enabled={settings.courseReminders}
                                onChange={(v) => setSettings({ ...settings, courseReminders: v })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <FiCheck size={18} className="text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Live Class Reminders</p>
                                    <p className="text-xs text-gray-400">Get reminded before live classes</p>
                                </div>
                            </div>
                            <Toggle
                                enabled={settings.liveClassReminders}
                                onChange={(v) => setSettings({ ...settings, liveClassReminders: v })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <FiMail size={18} className="text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Marketing Emails</p>
                                    <p className="text-xs text-gray-400">Receive promotional offers</p>
                                </div>
                            </div>
                            <Toggle
                                enabled={settings.marketingEmails}
                                onChange={(v) => setSettings({ ...settings, marketingEmails: v })}
                            />
                        </div>
                    </div>
                </SettingCard>

                {/* Privacy */}
                <SettingCard
                    icon={FiShield}
                    title="Privacy"
                    description="Control your profile visibility and data"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                Profile Visibility
                            </label>
                            <select
                                value={settings.profileVisibility}
                                onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                                className="w-full md:w-64 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                            >
                                <option value="public">Public - Anyone can see</option>
                                <option value="students">Students Only</option>
                                <option value="private">Private - Only you</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <FiEye size={18} className="text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Show Progress</p>
                                    <p className="text-xs text-gray-400">Display course progress on profile</p>
                                </div>
                            </div>
                            <Toggle
                                enabled={settings.showProgress}
                                onChange={(v) => setSettings({ ...settings, showProgress: v })}
                            />
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <FiEye size={18} className="text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Show Certificates</p>
                                    <p className="text-xs text-gray-400">Display earned certificates on profile</p>
                                </div>
                            </div>
                            <Toggle
                                enabled={settings.showCertificates}
                                onChange={(v) => setSettings({ ...settings, showCertificates: v })}
                            />
                        </div>
                    </div>
                </SettingCard>
            </div>
        </div>
    );
}
