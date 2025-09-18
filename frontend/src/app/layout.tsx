import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { metadata as c_metadata } from "../constants/metadata.constant";
import Footer from "@/components/footer.component";
import SocketParent from "@/components/socketparent.component";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = c_metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="flex-grow flex flex-col justify-center items-center">
          <SocketParent>{children}</SocketParent>
        </div>

        <Footer />
      </body>
    </html>
  );
}
