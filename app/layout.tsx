import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Client Dashboard",
  description: "Connected content planning, workflow and client performance.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {capable: true, title: "Client Dashboard", statusBarStyle: "default"},
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icons/dashboard-192.png",
  },
};

export const viewport: Viewport = {themeColor: "#142238"};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
