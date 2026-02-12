"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/redux/ReduxProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProvider>
            <ThemeProvider>
                <LanguageProvider>
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: "#111827",
                                color: "#fff",
                                borderRadius: "1rem",
                            },
                        }}
                    />
                    {children}
                </LanguageProvider>
            </ThemeProvider>
        </ReduxProvider>
    );
}
