import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InningsPro Report Upload",
  description: "Upload and process match reports."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
