import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThreadProvider } from "@/providers/thread-provider";
import { StreamProvider } from "@/providers/stream-provider";
import { FormProvider } from "@/providers/form-provider";
import { getDefaultConfigAction } from "@/lib/actions";
import { AssistantConfig } from "@/lib/types";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: defaultConfig } = await getDefaultConfigAction();
  // console.log(defaultConfig);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <NuqsAdapter>
            <Toaster position="top-center" />
            <ThreadProvider>
              <FormProvider>
                <StreamProvider
                  defaultConfig={defaultConfig as AssistantConfig}
                >
                  {children}
                </StreamProvider>
              </FormProvider>
            </ThreadProvider>
          </NuqsAdapter>
        </Suspense>
      </body>
    </html>
  );
}
