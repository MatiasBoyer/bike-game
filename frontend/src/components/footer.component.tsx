"use client";
import Image from "next/image";
import github_mark from "../assets/github-mark-white.svg";
import config from "@/utils/config.util";

export default function Footer() {
  return (
    <footer className="w-full p-4 text-xs flex flex-row justify-between items-center">
      <span>
        made with ♥<br />
        matías boyer
      </span>
      <span>
        <a href="https://github.com/MatiasBoyer/bike-game">
          <Image src={github_mark} alt="github-icon" width={24} height={24} />
        </a>
      </span>
      <span className="text-right">build {config.build}<br/>{config.branch}</span>
    </footer>
  );
}
