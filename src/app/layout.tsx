import type { Metadata } from "next";
import { Fraunces, Archivo } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const archivo = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coffee with Robots",
  description:
    "Every morning, two friendly robots catch you up on what the robots did yesterday — the day's AI news in plain English.",
  openGraph: {
    title: "Coffee with Robots",
    description: "The day's AI news in plain English — every morning, over coffee.",
    images: ["/covers/coffee-with-robots-web.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
