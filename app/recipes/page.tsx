"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import RecipeCard, { Recipe } from "@/components/RecipeCard";
import { ChevronDown, Loader2 } from "lucide-react";

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);

                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Recipe[];

                setRecipes(data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div className="text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">All Recipes</h1>
                    <p className="text-gray-400 text-sm mt-1">{recipes.length} recipes found</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-[#3A3633] px-4 py-2 rounded-xl text-sm border border-[#4a4542] hover:bg-[#4a4542] transition">
                        Cuisine <ChevronDown size={16} className="text-gray-400" />
                    </button>
                    <button className="flex items-center gap-2 bg-[#3A3633] px-4 py-2 rounded-xl text-sm border border-[#4a4542] hover:bg-[#4a4542] transition">
                        Difficulty <ChevronDown size={16} className="text-gray-400" />
                    </button>
                    <button className="flex items-center gap-2 bg-[#3A3633] px-4 py-2 rounded-xl text-sm border border-[#4a4542] hover:bg-[#4a4542] transition">
                        Prep Time <ChevronDown size={16} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-[#FCE07A]" size={40} />
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    No recipes found. Be the first to create one!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
}