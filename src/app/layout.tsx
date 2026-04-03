import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import { RoutineProvider } from "@/contexts/RoutineContext";
import { DietProvider } from "@/contexts/DietContext";
import { SleepProvider } from "@/contexts/SleepContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitLife",
  description: "종합 헬스 & 피트니스 앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <WorkoutProvider>
          <DietProvider>
            <SleepProvider>
              <RoutineProvider>
                <main className="flex-1 pb-20">
                  {children}
                </main>
                <BottomNav />
              </RoutineProvider>
            </SleepProvider>
          </DietProvider>
        </WorkoutProvider>
      </body>
    </html>
  );
}
