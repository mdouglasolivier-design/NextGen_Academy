import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "NextGen Academy: free courses, verifiable certificates",
    template: "%s | NextGen Academy",
  },
  description:
    "Learn for free, pass the assessment, and earn a certificate anyone can verify online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}