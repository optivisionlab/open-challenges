import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Open Challenges - AI/ML Competition Platform",
  description: "Join AI and machine learning competitions, submit your solutions, and compete on leaderboards",
  keywords: ["AI", "Machine Learning", "Competition", "Leaderboard", "Data Science"],
  authors: [{ name: "Open Challenges Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://openchallenges.com",
    siteName: "Open Challenges",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
