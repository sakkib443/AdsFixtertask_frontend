import {
    Poppins,
    Outfit,
    Inter,
    Roboto,
    Montserrat,
    Nunito,
    Lato,
    Open_Sans,
    Hind_Siliguri,
    Teko,
    Dancing_Script,
} from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Footer from "@/components/shared/Footer";
import { Metadata } from "next";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-inter",
    display: "swap",
});

const hindSiliguri = Hind_Siliguri({
    subsets: ["bengali", "latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-hind-siliguri",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Chatbot Flow Builder | AdsFixter Assessment",
    description: "Advanced visual chatbot flow builder dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`light ${poppins.variable} ${inter.variable} ${hindSiliguri.variable}`} suppressHydrationWarning>
            <body className="antialiased min-h-screen bg-gray-50" style={{ colorScheme: 'light' }} suppressHydrationWarning>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
