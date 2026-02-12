"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiArrowLeft, FiArrowRight, FiCheck, FiX, FiClock,
    FiAward, FiAlertCircle, FiLoader, FiCheckCircle
} from "react-icons/fi";

// Mock quiz data
const mockQuiz = {
    _id: "q1",
    title: "UI/UX Design Principles Quiz",
    description: "Test your knowledge of UI/UX fundamentals",
    timeLimit: 15, // minutes
    passingScore: 70,
    questions: [
        {
            _id: "q1",
            question: "What does UX stand for?",
            type: "single",
            options: [
                { id: "a", text: "User Experience" },
                { id: "b", text: "User Extension" },
                { id: "c", text: "Unified Experience" },
                { id: "d", text: "Universal Exchange" }
            ],
            correctAnswer: "a"
        },
        {
            _id: "q2",
            question: "Which of the following is a UX design principle?",
            type: "single",
            options: [
                { id: "a", text: "Make it complex" },
                { id: "b", text: "User-centered design" },
                { id: "c", text: "Ignore feedback" },
                { id: "d", text: "Maximize clicks" }
            ],
            correctAnswer: "b"
        },
        {
            _id: "q3",
            question: "What is the primary goal of user interface design?",
            type: "single",
            options: [
                { id: "a", text: "To make things look pretty" },
                { id: "b", text: "To confuse users" },
                { id: "c", text: "To create intuitive and efficient interaction" },
                { id: "d", text: "To use as many colors as possible" }
            ],
            correctAnswer: "c"
        },
        {
            _id: "q4",
            question: "Which color theory concept describes colors opposite each other on the color wheel?",
            type: "single",
            options: [
                { id: "a", text: "Analogous" },
                { id: "b", text: "Complementary" },
                { id: "c", text: "Triadic" },
                { id: "d", text: "Monochromatic" }
            ],
            correctAnswer: "b"
        },
        {
            _id: "q5",
            question: "What is a wireframe?",
            type: "single",
            options: [
                { id: "a", text: "A high-fidelity design" },
                { id: "b", text: "A basic structural layout of a page" },
                { id: "c", text: "A final product" },
                { id: "d", text: "A coding framework" }
            ],
            correctAnswer: "b"
        }
    ]
};

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState(mockQuiz);
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);

    // Timer
    useEffect(() => {
        if (!started || submitted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [started, submitted, timeLeft]);

    const startQuiz = () => {
        setStarted(true);
        setTimeLeft(quiz.timeLimit * 60);
    };

    const handleAnswer = (questionId, optionId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmit = () => {
        let correct = 0;
        quiz.questions.forEach(q => {
            if (answers[q._id] === q.correctAnswer) {
                correct++;
            }
        });

        const score = Math.round((correct / quiz.questions.length) * 100);
        const passed = score >= quiz.passingScore;

        setResult({
            correct,
            total: quiz.questions.length,
            score,
            passed
        });
        setSubmitted(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = quiz.questions[currentIndex];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <FiLoader className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    // Results Screen
    if (submitted && result) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
                >
                    {result.passed ? (
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <FiAward className="text-emerald-500" size={40} />
                        </div>
                    ) : (
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <FiX className="text-red-500" size={40} />
                        </div>
                    )}

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {result.passed ? "Congratulations!" : "Keep Learning!"}
                    </h1>
                    <p className="text-gray-500 mb-8">
                        {result.passed
                            ? "You have successfully passed the quiz!"
                            : `You need ${quiz.passingScore}% to pass. Try again!`}
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-8">
                        <div className="text-5xl font-black text-primary mb-2">{result.score}%</div>
                        <p className="text-sm text-gray-500">
                            {result.correct} of {result.total} correct answers
                        </p>
                    </div>

                    <div className="space-y-3">
                        {result.passed && (
                            <Link
                                href="/dashboard/user/certificates"
                                className="block w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors"
                            >
                                <FiAward className="inline mr-2" />
                                View Certificate
                            </Link>
                        )}
                        <Link
                            href={`/dashboard/user/courses/${params.courseId}/learn`}
                            className="block w-full py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white font-bold rounded-xl transition-colors"
                        >
                            Back to Course
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Start Screen
    if (!started) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <FiCheckCircle className="text-primary" size={40} />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {quiz.title}
                    </h1>
                    <p className="text-gray-500 mb-8">{quiz.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.questions.length}</p>
                            <p className="text-xs text-gray-500">Questions</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.timeLimit}</p>
                            <p className="text-xs text-gray-500">Minutes</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.passingScore}%</p>
                            <p className="text-xs text-gray-500">To Pass</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8">
                        <div className="flex items-start gap-3">
                            <FiAlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-sm text-yellow-700 dark:text-yellow-400 text-left">
                                Once you start, the timer cannot be paused. Make sure you have a stable internet connection.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={startQuiz}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors"
                    >
                        Start Quiz
                    </button>

                    <Link
                        href={`/dashboard/user/courses/${params.courseId}/learn`}
                        className="block mt-4 text-gray-500 hover:text-primary text-sm"
                    >
                        <FiArrowLeft className="inline mr-1" size={14} />
                        Back to Course
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Quiz Screen
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
                        <p className="text-sm text-gray-500">Question {currentIndex + 1} of {quiz.questions.length}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white'
                        }`}>
                        <FiClock size={18} />
                        {formatTime(timeLeft)}
                    </div>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-gray-100 dark:bg-gray-700">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
                    />
                </div>
            </header>

            {/* Question */}
            <main className="max-w-2xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            {currentQuestion.question}
                        </h2>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswer(currentQuestion._id, option.id)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[currentQuestion._id] === option.id
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[currentQuestion._id] === option.id
                                                ? 'border-primary bg-primary'
                                                : 'border-gray-300 dark:border-gray-600'
                                            }`}>
                                            {answers[currentQuestion._id] === option.id && (
                                                <FiCheck className="text-white" size={14} />
                                            )}
                                        </div>
                                        <span className="font-medium">{option.text}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                    <button
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <FiArrowLeft size={18} />
                        Previous
                    </button>

                    {currentIndex === quiz.questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors"
                        >
                            Submit Quiz
                            <FiCheck size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors"
                        >
                            Next
                            <FiArrowRight size={18} />
                        </button>
                    )}
                </div>

                {/* Question Navigator */}
                <div className="mt-8 flex flex-wrap gap-2 justify-center">
                    {quiz.questions.map((q, idx) => (
                        <button
                            key={q._id}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${currentIndex === idx
                                    ? 'bg-primary text-white'
                                    : answers[q._id]
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}
