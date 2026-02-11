import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "K8ts Estates | Katherine Minovski | Luxury Real Estate & Business Advisory",
  description: "Bespoke real estate and business advisory services powered by cutting-edge technology and white-glove service. Experience the future of real estate with Katherine Minovski.",
  keywords: "luxury real estate, business broker, Southern Ontario, AI-powered, white glove service, Vaughan, Toronto, RE/MAX",
  openGraph: {
    title: "K8ts Estates | Where Technology Meets Trust",
    description: "Bespoke real estate and business advisory services. Experience the future of real estate.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-brand-50 text-brand-900 antialiased">
        {children}
      </body>
    </html>
  );
}
