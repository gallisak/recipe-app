"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.svg";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#262220] text-white flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FCE07A] opacity-5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-[#FCE07A] opacity-5 blur-[120px] rounded-full"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <Image
          src={logo}
          alt="Logo"
          width={80}
          height={80}
          className="mb-6 animate-in fade-in zoom-in duration-700"
        />

        <h1 className="text-4xl md:text-6xl font-serif font-medium mb-6 leading-tight">
          Your Personal <span className="text-[#FCE07A]">Digital Cookbook</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
          Discover, create, and save your favorite recipes in one beautiful place.
          Built for chefs, by food enthusiasts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/recipes"
            className="bg-[#FCE07A] text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105 text-center"
          >
            Explore Recipes
          </Link>

          <Link
            href="/auth/signup"
            className="bg-[#3A3633] text-white border border-[#4a4542] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#4a4542] transition-all text-center"
          >
            Join Now
          </Link>
        </div>

        <div className="mt-16 flex items-center gap-8 text-gray-500 text-sm font-medium uppercase tracking-widest opacity-60">
          <span>Next.js 14</span>
          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
          <span>Firebase</span>
          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
          <span>Tailwind</span>
        </div>
      </div>
    </div>
  );
}