"use client";

import { Star, MoreHorizontal, Trash2, Edit2, Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { doc, deleteDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

export default function RecipeCard({ recipe, isFavorite }: { recipe: Recipe, isFavorite: boolean }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = user?.uid === recipe.userId;




    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this recipe?")) return;

        try {
            setIsDeleting(true);
            await deleteDoc(doc(db, "recipes", recipe.id));

            window.location.reload();
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Failed to delete recipe");
            setIsDeleting(false);
        }
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) return alert("Please log in to save recipes!");

        const userRef = doc(db, "users", user.uid);
        try {
            if (isFavorite) {
                // ДОДАНО { merge: true }
                await setDoc(userRef, { favoriteRecipes: arrayRemove(recipe.id) }, { merge: true });
            } else {
                // ДОДАНО { merge: true }
                await setDoc(userRef, { favoriteRecipes: arrayUnion(recipe.id) }, { merge: true });
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <div className={`bg-[#3A3633] rounded-2xl overflow-hidden flex flex-col border border-[#4a4542] transition-opacity ${isDeleting ? 'opacity-50' : ''}`}>
            <div className="relative">
                <Link href={`/recipes/${recipe.id}`} className="h-48 bg-gray-500 block cursor-pointer group overflow-hidden">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                </Link>
                <button
                    onClick={toggleFavorite}
                    className="absolute top-3 right-3 p-2 bg-[#262220]/80 backdrop-blur-sm rounded-full hover:scale-110 transition z-10"
                >
                    <Heart size={18} className={isFavorite ? "fill-[#FCE07A] text-[#FCE07A]" : "text-white"} />
                </button>
            </div>

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

                <div className="mt-auto flex items-center justify-between relative">
                    <div className="flex gap-2">
                        <span className="bg-[#FCE07A] text-black text-xs font-bold px-3 py-1.5 rounded-lg">
                            {recipe.prepTime} mins
                        </span>
                    </div>

                    {isOwner && (
                        <div>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-400 hover:text-white p-1 border border-gray-500 rounded-lg transition"
                            >
                                <MoreHorizontal size={20} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 bottom-full mb-2 w-32 bg-[#FCE07A] text-black rounded-xl shadow-lg overflow-hidden z-10 border border-yellow-500">
                                    <Link
                                        href={`/recipes/edit/${recipe.id}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-yellow-400 transition flex items-center gap-2 border-b border-yellow-500/30"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                                    >
                                        <Trash2 size={14} /> {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}