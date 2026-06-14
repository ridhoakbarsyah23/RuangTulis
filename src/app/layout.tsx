import type { Metadata } from "next";
import { Footer } from "./footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "RuangTulis",
  description: "A modern publishing workspace built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-stone-50">
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
