import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FullScreenWrapper from "./components/FullScreenWrapper";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  userScalable: false,
  themeColor: '#1e1e2f',
};

export const metadata = {
  title: "Juego del Impostor",
  description: "Juego del impostor - Diviértete con tus amigos",
  applicationName: "Juego del Impostor",
  keywords: ["juego", "impostor", "diversión", "amigos", "party game"],
  authors: [{ name: "Tu Nombre" }],
  themeColor: "#1e1e2f",
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <FullScreenWrapper>
          {children}
        </FullScreenWrapper>
      </body>
    </html>
  );
}
