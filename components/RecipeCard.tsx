"use client";

import { Star, MoreHorizontal, Trash2, Edit2, Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { doc, deleteDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import IconButton from "./ui/IconButton";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

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
                await setDoc(userRef, { favoriteRecipes: arrayRemove(recipe.id) }, { merge: true });
            } else {
                await setDoc(userRef, { favoriteRecipes: arrayUnion(recipe.id) }, { merge: true });
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <Card className={`flex flex-col h-full ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="relative group overflow-hidden">
                <Link href={`/recipes/${recipe.id}`} className="h-48 bg-gray-500 block overflow-hidden">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>

                <div className="absolute top-3 right-3">
                    <IconButton
                        icon={<Heart size={18} fill={isFavorite ? "currentColor" : "none"} />}
                        active={isFavorite}
                        onClick={toggleFavorite}
                    />
                </div>

                <div className="absolute top-3 left-3">
                    <Badge variant="primary">{recipe.category}</Badge>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <Link
                        href={`/recipes/${recipe.id}`}
                        className="text-white font-bold text-lg leading-tight hover:text-[#FCE07A] transition line-clamp-1"
                    >
                        {recipe.title}
                    </Link>
                    <div className="flex items-center gap-1 text-[#FCE07A] text-sm font-semibold shrink-0">
                        <Star size={14} fill="currentColor" />
                        <span>{recipe.rating || "New"}</span>
                    </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {recipe.description}
                </p>

                <div className="mt-auto flex items-center justify-between relative">
                    <Badge variant="outline">{recipe.prepTime} mins</Badge>

                    {isOwner && (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-400 hover:text-white p-1.5 border border-[#4a4542] rounded-lg transition-colors"
                            >
                                <MoreHorizontal size={18} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 bottom-full mb-3 w-36 bg-[#FCE07A] text-black rounded-xl shadow-2xl overflow-hidden z-20 border border-yellow-500 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <Link
                                        href={`/recipes/edit/${recipe.id}`}
                                        className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-yellow-400 transition flex items-center gap-2 border-b border-yellow-600/10"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full text-left px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-50 transition flex items-center gap-2"
                                    >
                                        <Trash2 size={14} /> {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}