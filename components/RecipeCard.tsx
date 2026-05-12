"use client";

import { Star, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function RecipeCard() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-[#FFFFFF29] rounded-2xl overflow-hidden flex flex-col border border-[#E6D8D633]">
            <div className="h-48 bg-gray-500 relative">
                <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop"
                    alt="Cake"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-bold text-lg leading-tight">Tacos al Pastor</h3>
                    <div className="flex items-center gap-1 text-[#FCE07A] text-sm font-semibold">
                        <Star size={16} fill="currentColor" />
                        <span>4.9</span>
                    </div>
                </div>

                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    Traditional Mexican tacos with pork.
                </p>
                <span className="text-gray-500 text-xs font-medium mb-4">Mexican</span>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex gap-2">
                        <span className="bg-[#FCE07A] text-black text-xs font-bold px-3 py-1.5 rounded-lg">1 hr</span>
                        <span className="bg-[#FCE07A] text-black text-xs font-bold px-3 py-1.5 rounded-lg">1.5 hrs</span>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-400 hover:text-white p-1 border border-gray-500 rounded-lg transition"
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 bottom-full mb-2 w-28 bg-[#FCE07A] text-black rounded-lg shadow-lg overflow-hidden z-10">
                                <button className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-yellow-400 transition">Edit</button>
                                <button className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-yellow-400 transition">Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}