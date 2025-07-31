import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "シンプルSES収入計算",
  description: "実際の給与と単価で妥当性チェックしてみよう",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className="font-mono"
      >
        {children}
      </body>
    </html>
  );
}
