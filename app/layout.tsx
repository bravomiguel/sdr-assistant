import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "@/providers/query-provider";
import { ThreadProvider } from "@/providers/thread-provider";
import { StreamProvider } from "@/providers/stream-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SDR Assistant",
  description: "SDR Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <Toaster position="top-center" />
          <QueryProvider>
            <ThreadProvider>
              <StreamProvider>{children}</StreamProvider>
            </ThreadProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
