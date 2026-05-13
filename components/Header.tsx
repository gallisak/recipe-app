"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFilter } from "@/contexts/FilterContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Bell, Plus, LogOut, Menu, X } from "lucide-react";
import logo from "../public/logo.png";
import Image from "next/image";

export default function Header() {
    const { profile } = useAuth();
    const { searchQuery, setSearchQuery } = useFilter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/auth/signin");
    };

    return (
        <>
            <header className="h-20 bg-[#2D2726] text-white flex items-center justify-between px-4 md:px-8 border-b border-[#3E3A37] sticky top-0 z-50">
                <Link href="/recipes" className="flex items-center gap-2 text-xl font-bold shrink-0">
                    <Image src={logo} alt="Logo" width={32} height={32} />
                    <span className={`${isMenuOpen ? 'hidden' : 'inline'} sm:inline`}>
                        Recipe<span className="text-[#FCE07A]">Finder</span>
                    </span>
                </Link>

                <div className="flex-1 max-w-xl mx-8 relative hidden sm:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-[#3E3A37] text-white border-2 border-[#E6DDD633] rounded-xl py-2.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#FCE07A] transition"
                    />
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <button className="text-gray-400 hover:text-white transition hidden sm:block">
                        <Bell size={22} />
                    </button>

                    <div className="hidden sm:flex items-center gap-3 bg-[#3E3A37] px-3 py-1.5 rounded-full hover:bg-[#4a4542] transition">
                        <div className="w-8 h-8 rounded-full bg-gray-500 overflow-hidden flex items-center justify-center text-xs font-bold">
                            {profile?.firstName?.charAt(0) || "U"}
                        </div>
                        <div className="hidden lg:flex flex-col text-sm">
                            <span className="font-medium text-white leading-tight">
                                {profile ? `${profile.firstName} ${profile.lastName}` : "User"}
                            </span>
                            <span className="text-[10px] text-gray-400 leading-tight">Chef</span>
                        </div>
                        <LogOut className="cursor-pointer ml-1" onClick={handleLogout} width={18} />
                    </div>

                    <Link
                        href="/recipes/new"
                        className="hidden sm:flex items-center gap-2 bg-[#FCE07A] text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-300 transition"
                    >
                        <Plus size={18} />
                        <span className="hidden lg:flex">New post</span>
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 sm:hidden text-white"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </header>

            {isMenuOpen && (
                <div className="fixed inset-0 top-20 bg-[#2D2726] z-40 sm:hidden flex flex-col p-6 gap-8 animate-in slide-in-from-top duration-300">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text"
                            placeholder="Search recipes..."
                            className="w-full bg-[#3E3A37] text-white border-2 border-[#E6DDD633] rounded-xl py-3 pl-12 pr-4 outline-none"
                        />
                    </div>

                    <nav className="flex flex-col gap-4">
                        <Link
                            href="/recipes/new"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-center gap-3 bg-[#FCE07A] text-black p-4 rounded-xl font-bold"
                        >
                            <Plus size={20} /> Create New Post
                        </Link>

                        <div className="bg-[#3E3A37] p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center font-bold">
                                    {profile?.firstName?.charAt(0) || "U"}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-white">
                                        {profile ? `${profile.firstName} ${profile.lastName}` : "User"}
                                    </span>
                                    <span className="text-xs text-gray-400">Chef</span>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="text-red-400 p-2">
                                <LogOut size={22} />
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}