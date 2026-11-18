import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "University Platform",
  description: "Free online certificates",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
