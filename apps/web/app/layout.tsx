import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patterned",
  description: "Digital dress form and garment preview platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
