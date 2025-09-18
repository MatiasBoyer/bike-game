import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { metadata as c_metadata } from "../constants/metadata.constant";
import Image from "next/image";
import github_mark from "../assets/github-mark-white.svg";

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
          {children}
        </div>

        <footer className="w-full p-4 text-xs flex flex-row justify-between">
          <span>
            made with ♥<br />
            matías boyer
          </span>
          <span>
            <a href="https://github.com/MatiasBoyer/">
              <Image src={github_mark} alt="github-icon" width={24} height={24} />
            </a>
          </span>
        </footer>
      </body>
    </html>
  );
}
