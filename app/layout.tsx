import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ResumeStoreHydration } from "@/components/providers/resume-store-hydration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CV Maker — Build & Export Your Resume",
  description:
    "Upload your resume, edit extracted content, preview a professional template, and download a PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ResumeStoreHydration />
        {children}
      </body>
    </html>
  );
}
