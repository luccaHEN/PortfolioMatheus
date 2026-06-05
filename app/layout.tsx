import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matheus Sousa QA",
  description: "A showcase of my projects and certifications.",
  icons: {
    icon: "/topIcon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' } }} />
      </body>
    </html>
  );
}