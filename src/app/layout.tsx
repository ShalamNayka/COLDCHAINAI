import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { VoiceAssistantBot } from "@/components/VoiceAssistantBot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriStorage | Modern Supply Chain",
  description: "Comprehensive Agricultural Supply Chain & Storage Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-neutral-50`}>
        {children}
        <Toaster position="top-center" richColors />
        <VoiceAssistantBot />
      </body>
    </html>
  );
}
