"use client";
import Image from "next/image";
import github_mark from "../assets/github-mark-white.svg";

export default function Footer() {
  return (
    <footer className="w-full p-4 text-xs flex flex-row justify-between">
      <span>
        made with ♥<br />
        matías boyer
      </span>
      <span>
        <a href="https://github.com/MatiasBoyer/bike-game">
          <Image src={github_mark} alt="github-icon" width={24} height={24} />
        </a>
      </span>
    </footer>
  );
}
