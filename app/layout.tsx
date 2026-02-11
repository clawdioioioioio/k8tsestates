import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "K8ts Estates | Katherine Minovski | Southern Ontario Real Estate & Business Brokerage",
  description: "Expert real estate and business brokerage services in Southern Ontario. Residential, commercial, and business sales with Katherine Minovski, Broker at RE/MAX.",
  keywords: "real estate, business broker, Southern Ontario, Vaughan, Markham, Toronto, commercial, residential, RE/MAX",
  openGraph: {
    title: "K8ts Estates | Katherine Minovski",
    description: "Expert real estate and business brokerage services in Southern Ontario.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-white text-brand-900 antialiased">
        {children}
      </body>
    </html>
  );
}
