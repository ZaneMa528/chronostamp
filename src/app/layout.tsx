import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Web3Provider } from "~/providers/Web3Provider";
import { Footer } from "~/components/layout/Footer";
import { NotificationContainer } from "~/components/ui/NotificationContainer";

export const metadata: Metadata = {
  title: "ChronoStamp Protocol",
  description: "Transform ephemeral life experiences into permanent, verifiable digital artifacts",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <Web3Provider>
          {children}
          <Footer />
          <NotificationContainer />
        </Web3Provider>
      </body>
    </html>
  );
}
