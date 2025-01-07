import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "./globals.scss";

import { Exo_2 } from "next/font/google";

export const metadata: Metadata = {
  title: "Drive To Revise",
  description: "Get miles ahead with your revision",
  openGraph: {
    images: [
      {
        url: "/favicon.svg",
        width: 800,
        height: 600,
        alt: "Drive To Revise Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/favicon.svg"],
  },
};

// Configure Exo 2 font
const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["300", "500"],
  style: ["normal"], 
  display: "swap", 
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={exo2.className}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
