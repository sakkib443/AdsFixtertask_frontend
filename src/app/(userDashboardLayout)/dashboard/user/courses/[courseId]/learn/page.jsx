"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPlay, FiCheck, FiLock, FiChevronLeft, FiChevronDown,
    FiChevronRight, FiLoader, FiAward, FiClock, FiBook,
    FiFile, FiDownload, FiCheckCircle, FiMenu, FiX
} from "react-icons/fi";
import { enrollmentService, lessonService } from "@/services/api";

// Mock data for course player
const mockCourse = {
    _id: "1",
    title: "Complete UI/UX Design Masterclass",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200",
    instructor: { firstName: "Zayed", lastName: "Uddin" },
    totalLessons: 24,
    totalDuration: 720, // minutes
};

const mockModules = [
    {
        _id: "m1",
        title: "Getting Started with UI/UX",
        lessons: [
            { _id: "l1", title: "Introduction to UI/UX Design", duration: 15, isCompleted: true, isFree: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
            { _id: "l2", title: "Setting Up Your Design Environment", duration: 20, isCompleted: true, isFree: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
            { _id: "l3", title: "Understanding Design Tools", duration: 25, isCompleted: false, isFree: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ]
    },
    {
        _id: "m2",
        title: "Design Principles",
        lessons: [
            { _id: "l4", title: "Color Theory Fundamentals", duration: 30, isCompleted: false, isFree: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
            { _id: "l5", title: "Typography Best Practices", duration: 25, isCompleted: false, isFree: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
            { _id: "l6", title: "Layout and Composition", duration: 35, isCompleted: false, isFree: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ]
    },
    {
        _id: "m3",
        title: "User Experience Basics",
        lessons: [
            { _id: "l7", title: "Understanding User Research", duration: 40, isCompleted: false, isFree: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
            { _id: "l8", title: "Creating User Personas", duration: 30, isCompleted: false, isFree: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
            { _id: "l9", title: "User Journey Mapping", duration: 35, isCompleted: false, isFree: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ]
    },
];

export default function CoursePlayerPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(mockCourse);
    const [modules, setModules] = useState(mockModules);
    const [loading, setLoading] = useState(false);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [expandedModules, setExpandedModules] = useState(["m1"]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Calculate progress
    const allLessons = modules.flatMap(m => m.lessons);
    const completedLessons = allLessons.filter(l => l.isCompleted).length;
    const progress = Math.round((completedLessons / allLessons.length) * 100);

    useEffect(() => {
        // Set first incomplete lesson or first lesson as current
        const firstIncomplete = allLessons.find(l => !l.isCompleted);
        setCurrentLesson(firstIncomplete || allLessons[0]);
    }, []);

    const toggleModule = (moduleId) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleLessonSelect = (lesson) => {
        setCurrentLesson(lesson);
        setMobileMenuOpen(false);
    };

    const handleMarkComplete = () => {
        if (!currentLesson) return;

        setModules(modules.map(module => ({
            ...module,
            lessons: module.lessons.map(lesson =>
                lesson._id === currentLesson._id
                    ? { ...lesson, isCompleted: true }
                    : lesson
            )
        })));

        // Move to next lesson
        const currentIndex = allLessons.findIndex(l => l._id === currentLesson._id);
        if (currentIndex < allLessons.length - 1) {
            setCurrentLesson(allLessons[currentIndex + 1]);
        }
    };

    const goToNextLesson = () => {
        const currentIndex = allLessons.findIndex(l => l._id === currentLesson._id);
        if (currentIndex < allLessons.length - 1) {
            setCurrentLesson(allLessons[currentIndex + 1]);
        }
    };

    const goToPrevLesson = () => {
        const currentIndex = allLessons.findIndex(l => l._id === currentLesson._id);
        if (currentIndex > 0) {
            setCurrentLesson(allLessons[currentIndex - 1]);
        }
    };

    const formatDuration = (minutes) => {
        if (minutes < 60) return `${minutes}min`;
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FiLoader className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                <Link href="/dashboard/user/courses" className="flex items-center gap-2 text-white">
                    <FiChevronLeft size={20} />
                    <span className="text-sm">Back</span>
                </Link>
                <span className="text-white font-medium text-sm truncate mx-4">{course.title}</span>
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 text-white"
                >
                    <FiMenu size={24} />
                </button>
            </div>

            {/* Video Player Area */}
            <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:mr-96' : ''}`}>
                {/* Video Player */}
                <div className="relative bg-black aspect-video w-full">
                    {currentLesson?.videoUrl ? (
                        <iframe
                            src={currentLesson.videoUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FiPlay className="text-gray-600" size={64} />
                        </div>
                    )}
                </div>

                {/* Lesson Info & Controls */}
                <div className="p-4 lg:p-6 bg-gray-800 flex-1">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={goToPrevLesson}
                            disabled={allLessons.findIndex(l => l._id === currentLesson?._id) === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <FiChevronLeft size={18} />
                            Previous
                        </button>
                        <button
                            onClick={goToNextLesson}
                            disabled={allLessons.findIndex(l => l._id === currentLesson?._id) === allLessons.length - 1}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <FiChevronRight size={18} />
                        </button>
                    </div>

                    {/* Lesson Title */}
                    <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">
                        {currentLesson?.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
                        <span className="flex items-center gap-1">
                            <FiClock size={14} />
                            {formatDuration(currentLesson?.duration || 0)}
                        </span>
                        {currentLesson?.isCompleted && (
                            <span className="flex items-center gap-1 text-emerald-400">
                                <FiCheckCircle size={14} />
                                Completed
                            </span>
                        )}
                    </div>

                    {/* Mark Complete Button */}
                    {!currentLesson?.isCompleted && (
                        <button
                            onClick={handleMarkComplete}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors"
                        >
                            <FiCheck size={20} />
                            Mark as Complete
                        </button>
                    )}

                    {/* Lesson Materials */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-white mb-4">Lesson Materials</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <FiFile className="text-blue-400" size={20} />
                                    <span className="text-gray-300">Lesson Notes.pdf</span>
                                </div>
                                <button className="p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <FiDownload size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar - Desktop */}
            <aside className={`hidden lg:flex flex-col w-96 bg-gray-800 border-l border-gray-700 fixed right-0 top-0 h-screen overflow-hidden ${sidebarOpen ? '' : 'translate-x-full'}`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-700">
                    <Link
                        href="/dashboard/user/courses"
                        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
                    >
                        <FiChevronLeft size={16} />
                        Back to My Courses
                    </Link>
                    <h2 className="text-lg font-bold text-white line-clamp-2">{course.title}</h2>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">{completedLessons} of {allLessons.length} lessons</span>
                            <span className="text-emerald-400 font-bold">{progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {progress === 100 && (
                            <Link
                                href="/dashboard/user/certificates"
                                className="flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition-colors"
                            >
                                <FiAward size={18} />
                                Get Certificate
                            </Link>
                        )}
                    </div>
                </div>

                {/* Modules List */}
                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    {modules.map((module, moduleIndex) => (
                        <div key={module._id} className="border-b border-gray-700">
                            <button
                                onClick={() => toggleModule(module._id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-400 text-sm font-bold">
                                        {moduleIndex + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white text-sm">{module.title}</p>
                                        <p className="text-xs text-gray-500">
                                            {module.lessons.filter(l => l.isCompleted).length}/{module.lessons.length} completed
                                        </p>
                                    </div>
                                </div>
                                <FiChevronDown
                                    className={`text-gray-400 transition-transform ${expandedModules.includes(module._id) ? 'rotate-180' : ''
                                        }`}
                                    size={18}
                                />
                            </button>

                            <AnimatePresence>
                                {expandedModules.includes(module._id) && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        {module.lessons.map((lesson, lessonIndex) => (
                                            <button
                                                key={lesson._id}
                                                onClick={() => handleLessonSelect(lesson)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 pl-8 transition-colors ${currentLesson?._id === lesson._id
                                                        ? 'bg-primary/20 border-l-2 border-primary'
                                                        : 'hover:bg-gray-700/30'
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${lesson.isCompleted
                                                        ? 'bg-emerald-500 text-white'
                                                        : currentLesson?._id === lesson._id
                                                            ? 'bg-primary text-white'
                                                            : 'bg-gray-700 text-gray-400'
                                                    }`}>
                                                    {lesson.isCompleted ? (
                                                        <FiCheck size={12} />
                                                    ) : (
                                                        <FiPlay size={10} />
                                                    )}
                                                </div>
                                                <div className="flex-1 text-left min-w-0">
                                                    <p className={`text-sm truncate ${currentLesson?._id === lesson._id ? 'text-primary font-medium' : 'text-gray-300'
                                                        }`}>
                                                        {lesson.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{formatDuration(lesson.duration)}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed right-0 top-0 h-full w-80 bg-gray-800 z-50 lg:hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                <h3 className="font-bold text-white">Course Content</h3>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400">
                                    <FiX size={24} />
                                </button>
                            </div>
                            <div className="p-4 border-b border-gray-700">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-400">{completedLessons}/{allLessons.length} lessons</span>
                                    <span className="text-emerald-400 font-bold">{progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {modules.map((module, moduleIndex) => (
                                    <div key={module._id} className="border-b border-gray-700">
                                        <button
                                            onClick={() => toggleModule(module._id)}
                                            className="w-full flex items-center justify-between p-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                                                    {moduleIndex + 1}
                                                </span>
                                                <span className="text-sm font-medium text-white">{module.title}</span>
                                            </div>
                                            <FiChevronDown className={`text-gray-400 ${expandedModules.includes(module._id) ? 'rotate-180' : ''}`} />
                                        </button>
                                        {expandedModules.includes(module._id) && (
                                            <div>
                                                {module.lessons.map((lesson) => (
                                                    <button
                                                        key={lesson._id}
                                                        onClick={() => handleLessonSelect(lesson)}
                                                        className={`w-full flex items-center gap-3 px-4 py-3 pl-12 ${currentLesson?._id === lesson._id ? 'bg-primary/20' : ''
                                                            }`}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${lesson.isCompleted ? 'bg-emerald-500' : 'bg-gray-700'
                                                            }`}>
                                                            {lesson.isCompleted ? <FiCheck size={10} className="text-white" /> : <FiPlay size={8} className="text-gray-400" />}
                                                        </div>
                                                        <span className="text-sm text-gray-300 truncate">{lesson.title}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
