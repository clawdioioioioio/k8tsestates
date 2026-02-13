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
  title: "K8ts Estates | Katherine Minovski | Modern Real Estate & Business Advisory",
  description: "Where technology meets trust. AI-powered real estate and business advisory for discerning clients in Southern Ontario.",
  keywords: "real estate, business broker, Southern Ontario, AI-powered, Vaughan, Toronto, RE/MAX",
  openGraph: {
    title: "K8ts Estates | Technology Meets Trust",
    description: "AI-powered real estate and business advisory. Experience the future.",
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
      <body className="bg-brand-50 text-brand-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
