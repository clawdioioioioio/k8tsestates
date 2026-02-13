import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "K8ts Estates | Katherine Minovski | Real Estate & Business Brokerage",
  description: "Corporate-level strategy meets personal attention. Residential, commercial, and business brokerage for clients who expect more. Licensed RE/MAX Broker.",
  keywords: "real estate, business broker, Southern Ontario, Vaughan, Toronto, RE/MAX, commercial, residential",
  openGraph: {
    title: "K8ts Estates | Real Estate, Reimagined",
    description: "Corporate-level strategy meets personal attention. Residential, commercial, and business brokerage.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="bg-base text-brand-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
