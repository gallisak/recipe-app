"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FullRecipe {
    id: string;
    title: string;
    description: string;
    category: string;
    prepTime: number;
    rating: number;
    image: string;
    author: string;
    ingredients: string[];
    instructions: string[];
    createdAt: any;
}

export default function RecipeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [recipe, setRecipe] = useState<FullRecipe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const docRef = doc(db, "recipes", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setRecipe({ id: docSnap.id, ...docSnap.data() } as FullRecipe);
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching recipe:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) {
        return (
            <div className="text-white animate-pulse max-w-212.5 mx-auto py-10">
                <div className="h-8 w-24 bg-[#3A3633] rounded mb-8"></div>
                <div className="h-4 w-32 bg-[#3A3633] rounded mb-4"></div>
                <div className="h-12 w-3/4 bg-[#3A3633] rounded mb-4"></div>
                <div className="h-100 w-full bg-[#3A3633] rounded mb-8"></div>
            </div>
        );
    }

    if (!recipe) {
        return <div className="text-center text-white py-20 text-xl font-bold">Recipe not found</div>;
    }

    const publishDate = recipe.createdAt?.toDate
        ? recipe.createdAt.toDate().toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })
        : "October 15, 2023"; // Дефолтна дата як на макеті, якщо немає реальної

    return (
        <div className="text-[#D5D0C8] max-w-212.5 mx-auto pb-24 px-4 md:px-0">

            {/* Кнопка "Back" */}
            <div className="mb-8 pt-4">
                <Link href="/recipes" className="inline-flex items-center gap-1.5 bg-[#FCE07A] text-black px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-yellow-400 transition">
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    <span>Back</span>
                </Link>
            </div>

            {/* Хлібні крихти / Категорія */}
            <p className="text-[#FCE07A] text-xs font-bold mb-3">
                {recipe.category || "Dessert"}, Baking, Lemon
            </p>

            {/* Головний заголовок і опис */}
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-white mb-4 tracking-wide">
                {recipe.title}
            </h1>
            <p className="text-gray-300 text-[15px] mb-8">
                {recipe.description}
            </p>

            {/* Головне зображення */}
            <div className="w-full mb-2">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-75 md:h-112.5 object-cover"
                />
            </div>
            {/* Підпис під фото (як на макеті) */}
            <p className="text-xs text-gray-500 mb-8">
                A slice of {recipe.title.toLowerCase()} on a plate.
            </p>

            {/* Мета-дані (Дата та Автор) */}
            <div className="mb-12">
                <p className="text-[11px] text-gray-400 mb-3">{publishDate}</p>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FCE07A] text-black flex items-center justify-center font-bold text-lg overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-[13px] leading-tight">{recipe.author}</span>
                        <span className="text-[11px] text-gray-500">Pastry Chef</span>
                    </div>
                </div>
            </div>

            {/* Introduction */}
            <div className="mb-12">
                <h2 className="text-3xl font-serif text-gray-200 mb-4 tracking-wide">Introduction</h2>
                <p className="text-gray-300 text-[15px] leading-relaxed">
                    {recipe.description} This {recipe.title.toLowerCase()} is a timeless classic that combines the tartness of lemons with the sweetness of sugar, creating a moist and flavorful dessert. Perfect for afternoon tea or as a delightful treat for any occasion.
                </p>
            </div>

            {/* Ingredients */}
            <div className="mb-12">
                <h2 className="text-3xl font-serif text-gray-200 mb-5 tracking-wide">Ingredients</h2>
                <div className="flex flex-col gap-3">
                    {recipe.ingredients.map((item, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center shrink-0">
                                <input type="checkbox" className="peer appearance-none w-4.5 h-4.5 border-[1.5px] border-gray-400 rounded-sm checked:bg-transparent checked:border-gray-400 cursor-pointer transition" />
                                <svg className="absolute w-3.5 h-3.5 text-gray-300 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-[15px] text-gray-300 group-hover:text-white transition">
                                {item}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div>
                <h2 className="text-3xl font-serif text-gray-200 mb-5 tracking-wide">Instructions</h2>
                <div className="flex flex-col gap-4">
                    {recipe.instructions.map((step, idx) => (
                        <p key={idx} className="text-[15px] text-gray-300 leading-relaxed">
                            <span className="font-bold text-gray-200 mr-2">{idx + 1}.</span>
                            {step}
                        </p>
                    ))}
                </div>
            </div>

        </div>
    );
}