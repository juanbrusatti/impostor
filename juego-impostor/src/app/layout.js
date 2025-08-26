import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FullScreenHandler from "@/components/FullScreenHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Juego del Impostor",
  description: "Juego del impostor - Diviértete con tus amigos",
  applicationName: "Juego del Impostor",
  keywords: ["juego", "impostor", "diversión", "amigos", "party game"],
  authors: [{ name: "Tu Nombre" }],
  themeColor: "#1e1e2f",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
    userScalable: false
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Juego del Impostor",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Juego del Impostor",
    title: "Juego del Impostor",
    description: "Diviértete con tus amigos en este emocionante juego",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juego del Impostor",
    description: "Diviértete con tus amigos en este emocionante juego",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
