import type { Metadata } from "next";
import "./globals.css";

import { Exo_2 } from "next/font/google";

export const metadata: Metadata = {
  title: "Drive To Revise",
  description: "Get miles ahead with your revision",
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
      <body>
        {children}
      </body>
    </html>
  );
}
