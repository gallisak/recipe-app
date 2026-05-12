"use client";

import { Star, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Описуємо, які дані чекає картка
export interface Recipe {
    id: string;
    title: string;
    description: string;
    category: string;
    prepTime: number;
    rating: number;
    image: string;
    userId: string;
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-[#3A3633] rounded-2xl overflow-hidden flex flex-col border border-[#4a4542]">
            {/* Картинка (тепер клікабельна) */}
            <Link href={`/recipes/${recipe.id}`} className="h-48 bg-gray-500 relative block cursor-pointer group overflow-hidden">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
            </Link>

            {/* Контент */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <Link href={`/recipes/${recipe.id}`} className="text-white font-bold text-lg leading-tight hover:text-[#FCE07A] transition line-clamp-1">
                        {recipe.title}
                    </Link>
                    <div className="flex items-center gap-1 text-[#FCE07A] text-sm font-semibold shrink-0">
                        <Star size={16} fill="currentColor" />
                        <span>{recipe.rating || "New"}</span>
                    </div>
                </div>

                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {recipe.description}
                </p>
                <span className="text-gray-500 text-xs font-medium mb-4">{recipe.category}</span>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex gap-2">
                        <span className="bg-[#FCE07A] text-black text-xs font-bold px-3 py-1.5 rounded-lg">
                            {recipe.prepTime} mins
                        </span>
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