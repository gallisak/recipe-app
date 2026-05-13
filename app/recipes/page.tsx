"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFilter } from "@/contexts/FilterContext";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types/recipe";
import RecipeCardSkeleton from "@/components/ui/RecipeCardSkeleton";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import Button from "@/components/ui/Button";

const cuisines = ["Vegan", "Dessert", "Italian", "Breakfast", "Mexican", "Asian"];
const difficulties = ["Easy", "Medium", "Hard"];
const prepTimes = ["Under 15 mins", "15-30 mins", "30-60 mins", "Over 1 hr"];

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [topDifficulty, setTopDifficulty] = useState("");

    const { user } = useAuth();
    const [userFavorites, setUserFavorites] = useState<string[]>([]);

    const {
        searchQuery,
        selectedCategories,
        setSelectedCategories,
        toggleCategory,
        prepTime,
        setPrepTime,
        showFavorites
    } = useFilter();

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

    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
            if (doc.exists()) {
                setUserFavorites(doc.data()?.favoriteRecipes || []);
            }
        });
        return () => unsub();
    }, [user]);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const filteredRecipes = recipes.filter((recipe) => {
        if (showFavorites && !userFavorites.includes(recipe.id)) return false;

        const searchMatch = searchQuery === "" ||
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

        const categoryMatch = selectedCategories.length === 0 ||
            selectedCategories.includes(recipe.category);

        let timeMatch = true;
        if (prepTime === "Under 15 mins") timeMatch = recipe.prepTime < 15;
        else if (prepTime === "15-30 mins") timeMatch = recipe.prepTime >= 15 && recipe.prepTime <= 30;
        else if (prepTime === "30-60 mins") timeMatch = recipe.prepTime > 30 && recipe.prepTime <= 60;
        else if (prepTime === "Over 1 hr") timeMatch = recipe.prepTime > 60;

        return searchMatch && categoryMatch && timeMatch;
    });

    return (
        <div className="text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">All Recipes</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {loading ? "Searching..." : `${filteredRecipes.length} recipes found`}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <div className="relative flex-1 min-w-32 md:flex-none">
                        <Button
                            variant="secondary"
                            onClick={() => toggleDropdown("cuisine")}
                            className="w-full justify-between"
                            icon={<ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${openDropdown === "cuisine" ? "rotate-180" : ""}`} />}
                        >
                            <span className="truncate">
                                {selectedCategories.length === 0 ? "Cuisine" : selectedCategories.length === 1 ? selectedCategories[0] : `Cuisines (${selectedCategories.length})`}
                            </span>
                        </Button>
                        {openDropdown === "cuisine" && (
                            <div className="absolute left-0 md:right-0 top-full mt-2 w-40 bg-[#3A3633] border border-[#4a4542] rounded-xl shadow-2xl overflow-hidden z-20">
                                <button
                                    onClick={() => { setSelectedCategories([]); setOpenDropdown(null); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-[#4a4542] ${selectedCategories.length === 0 ? "text-[#FCE07A] font-bold" : "text-gray-300"}`}
                                >
                                    Any Cuisine
                                </button>
                                <hr className="border-[#4a4542] mx-2" />
                                {cuisines.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => { toggleCategory(c); setOpenDropdown(null); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-[#4a4542] ${selectedCategories.includes(c) ? "text-[#FCE07A] font-bold" : "text-gray-300"}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative flex-1 min-w-32 md:flex-none">
                        <Button
                            variant="secondary"
                            onClick={() => toggleDropdown("difficulty")}
                            className="w-full justify-between"
                            icon={<ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${openDropdown === "difficulty" ? "rotate-180" : ""}`} />}
                        >
                            <span className="truncate">{topDifficulty || "Difficulty"}</span>
                        </Button>
                        {openDropdown === "difficulty" && (
                            <div className="absolute left-0 md:right-0 top-full mt-2 w-40 bg-[#3A3633] border border-[#4a4542] rounded-xl shadow-lg overflow-hidden z-20">
                                <button
                                    onClick={() => { setTopDifficulty(""); setOpenDropdown(null); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-[#4a4542] ${topDifficulty === "" ? "text-[#FCE07A] font-bold" : "text-gray-400"}`}
                                >
                                    Any
                                </button>
                                {difficulties.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => { setTopDifficulty(d); setOpenDropdown(null); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-[#4a4542] ${topDifficulty === d ? "text-[#FCE07A] font-bold" : "text-gray-300"}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative flex-1 min-w-32 md:flex-none">
                        <Button
                            variant="secondary"
                            onClick={() => toggleDropdown("prep")}
                            className="w-full justify-between"
                            icon={<ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${openDropdown === "prep" ? "rotate-180" : ""}`} />}
                        >
                            <span className="truncate">{prepTime ? prepTime.replace(" mins", "m").replace(" hr", "h") : "Prep Time"}</span>
                        </Button>
                        {openDropdown === "prep" && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#3A3633] border border-[#4a4542] rounded-xl shadow-lg overflow-hidden z-20">
                                <button
                                    onClick={() => { setPrepTime(""); setOpenDropdown(null); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-[#4a4542] ${prepTime === "" ? "text-[#FCE07A] font-bold" : "text-gray-400"}`}
                                >
                                    Any Time
                                </button>
                                <hr className="border-[#4a4542] mx-2" />
                                {prepTimes.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => { setPrepTime(t); setOpenDropdown(null); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-[#4a4542] ${prepTime === t ? "text-[#FCE07A] font-bold" : "text-gray-300"}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <RecipeCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredRecipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#3A3633]/30 rounded-2xl border border-dashed border-[#4a4542]">
                    <p className="text-gray-500 mb-4">No recipes found matching your filters.</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedCategories([]); setPrepTime(""); setTopDifficulty(""); }}
                    >
                        Clear all filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard
                            isFavorite={userFavorites.includes(recipe.id)}
                            key={recipe.id}
                            recipe={recipe}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}