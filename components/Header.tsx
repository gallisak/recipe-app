"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Bell, Plus, ChevronDown } from "lucide-react";
import logo from "../public/logo.png";
import Image from "next/image";

export default function Header() {
    const { profile } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/auth/signin");
    };

    return (
        <header className="h-20 bg-[#2D2726] text-white flex items-center justify-between px-8 border-b border-[#3E3A37] sticky top-0 z-50">
            {/* Logo */}
            <Link href="/recipes" className="flex items-center gap-2 text-xl font-bold">
                <Image src={logo} alt="Logo" />
                Recipe<span className="text-[#FCE07A]">Finder</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-[#3E3A37] text-white border-2 border-[#E6DDD633] rounded-xl py-2.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#FCE07A] transition"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <button className="text-gray-400 hover:text-white transition">
                    <Bell size={22} />
                </button>

                {/* User Profile */}
                <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 bg-[#3E3A37] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#4a4542] transition"
                    title="Click to Log Out"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-500 overflow-hidden flex items-center justify-center text-xs font-bold">
                        {profile?.firstName?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col text-sm hidden sm:flex">
                        <span className="font-medium text-white leading-tight">
                            {profile ? `${profile.firstName} ${profile.lastName}` : "User"}
                        </span>
                        <span className="text-[10px] text-gray-400 leading-tight">Chef</span>
                    </div>
                    <ChevronDown size={16} className="text-gray-400" />
                </div>

                {/* New Post Button */}
                <Link
                    href="/recipes/new"
                    className="flex items-center gap-2 bg-[#FCE07A] text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-300 transition"
                >
                    <Plus size={18} />
                    <span>New post</span>
                </Link>
            </div>
        </header>
    );
}