"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiAward, FiDownload, FiEye, FiLoader, FiCalendar,
    FiBook, FiShare2, FiCheckCircle
} from "react-icons/fi";

// Mock certificates
const mockCertificates = [
    {
        _id: "1",
        course: {
            title: "Complete UI/UX Design Masterclass",
            thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400"
        },
        completedAt: new Date("2024-01-15"),
        certificateNumber: "CH-2024-001234",
        grade: "A+",
        score: 95
    },
    {
        _id: "2",
        course: {
            title: "Graphic Design Fundamentals",
            thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400"
        },
        completedAt: new Date("2024-01-10"),
        certificateNumber: "CH-2024-001189",
        grade: "A",
        score: 88
    },
];

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setCertificates(mockCertificates);
            setLoading(false);
        }, 500);
    }, []);

    const handleDownload = (cert) => {
        // In real app, this would generate and download PDF
        alert(`Downloading certificate: ${cert.certificateNumber}`);
    };

    const handleShare = (cert) => {
        if (navigator.share) {
            navigator.share({
                title: `Certificate - ${cert.course.title}`,
                text: `I completed ${cert.course.title} on CreativeHub!`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Certificates</h1>
                <p className="text-gray-500">Download and share your earned certificates</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl p-6 text-white">
                    <FiAward size={32} className="mb-3" />
                    <p className="text-3xl font-bold">{certificates.length}</p>
                    <p className="text-yellow-100">Certificates Earned</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <FiBook size={32} className="text-blue-500 mb-3" />
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{certificates.length}</p>
                    <p className="text-gray-500">Courses Completed</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <FiCheckCircle size={32} className="text-emerald-500 mb-3" />
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {certificates.length > 0 ? Math.round(certificates.reduce((a, b) => a + b.score, 0) / certificates.length) : 0}%
                    </p>
                    <p className="text-gray-500">Average Score</p>
                </div>
            </div>

            {/* Certificates List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <FiLoader className="animate-spin text-primary" size={32} />
                </div>
            ) : certificates.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <FiAward className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        No certificates yet
                    </h3>
                    <p className="text-gray-500">Complete a course to earn your first certificate</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                        >
                            {/* Certificate Preview */}
                            <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-8">
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                        {cert.grade}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <FiAward className="mx-auto text-yellow-500 mb-4" size={48} />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        Certificate of Completion
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {cert.course.title}
                                    </p>
                                    <p className="text-xs text-gray-400 font-mono">
                                        #{cert.certificateNumber}
                                    </p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FiCalendar size={14} />
                                        Completed on {cert.completedAt.toLocaleDateString()}
                                    </div>
                                    <div className="text-sm font-bold text-emerald-500">
                                        Score: {cert.score}%
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedCert(cert)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white font-medium rounded-xl transition-colors"
                                    >
                                        <FiEye size={18} />
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDownload(cert)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition-colors"
                                    >
                                        <FiDownload size={18} />
                                        Download
                                    </button>
                                    <button
                                        onClick={() => handleShare(cert)}
                                        className="px-4 py-3 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 text-blue-600 font-medium rounded-xl transition-colors"
                                    >
                                        <FiShare2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Certificate Modal */}
            {selectedCert && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedCert(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Certificate Full View */}
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-12 text-center border-b-4 border-yellow-500">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500 flex items-center justify-center">
                                <FiAward className="text-white" size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
                            <p className="text-lg text-gray-600 mb-8">This is to certify that</p>
                            <p className="text-2xl font-bold text-primary mb-4">Student Name</p>
                            <p className="text-gray-600 mb-2">has successfully completed</p>
                            <p className="text-xl font-bold text-gray-900 mb-8">{selectedCert.course.title}</p>
                            <div className="flex items-center justify-center gap-8">
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-bold">{selectedCert.completedAt.toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Grade</p>
                                    <p className="font-bold text-yellow-600">{selectedCert.grade}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Certificate ID</p>
                                    <p className="font-mono text-sm">{selectedCert.certificateNumber}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 flex gap-4">
                            <button
                                onClick={() => handleDownload(selectedCert)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl"
                            >
                                <FiDownload size={20} />
                                Download PDF
                            </button>
                            <button
                                onClick={() => setSelectedCert(null)}
                                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold rounded-xl"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
