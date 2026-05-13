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
            <div className="text-white animate-pulse max-w-[850px] mx-auto py-10 px-4">
                <div className="h-8 w-24 bg-[#3A3633] rounded mb-8"></div>
                <div className="h-4 w-32 bg-[#3A3633] rounded mb-4"></div>
                <div className="h-10 w-3/4 bg-[#3A3633] rounded mb-4"></div>
                <div className="h-64 w-full bg-[#3A3633] rounded mb-8"></div>
            </div>
        );
    }

    if (!recipe) {
        return <div className="text-center text-white py-20 text-xl font-bold">Recipe not found</div>;
    }

    const publishDate = recipe.createdAt?.toDate
        ? recipe.createdAt.toDate().toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })
        : "October 15, 2023";

    return (
        <div className="text-[#D5D0C8] max-w-[850px] mx-auto pb-24 px-4 sm:px-6 lg:px-0 overflow-x-hidden">

            {/* Back Button */}
            <div className="mb-6 md:mb-8 pt-4">
                <Link href="/recipes" className="inline-flex items-center gap-1.5 bg-[#FCE07A] text-black px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-yellow-400 transition">
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    <span>Back</span>
                </Link>
            </div>

            <p className="text-[#FCE07A] text-[10px] md:text-xs font-bold mb-3 uppercase tracking-wider">
                {recipe.category || "General"}
            </p>

            <h1 className="text-2xl md:text-5xl font-serif font-medium text-white mb-4 tracking-wide leading-tight break-words">
                {recipe.title}
            </h1>

            <p className="text-gray-300 text-sm md:text-lg mb-8 leading-relaxed break-words">
                {recipe.description}
            </p>

            {/* Main Image Container */}
            <div className="w-full mb-3 overflow-hidden rounded-lg bg-[#3A3633]">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-auto min-h-[200px] max-h-[500px] object-cover block"
                />
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 mb-8 italic">
                A slice of {recipe.title.toLowerCase()} prepared by our chef.
            </p>

            {/* Author Section */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#3E3A37] pb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0">
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
                <p className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-tight">{publishDate}</p>
            </div>

            {/* Introduction */}
            <div className="mb-10">
                <h2 className="text-xl md:text-3xl font-serif text-gray-200 mb-4 tracking-wide">Introduction</h2>
                <p className="text-gray-300 text-sm md:text-[15px] leading-relaxed break-words">
                    This {recipe.title.toLowerCase()} is a timeless classic that combines the tartness of lemons with the sweetness of sugar. Perfect for any occasion.
                </p>
            </div>

            {/* Ingredients */}
            <div className="mb-10">
                <h2 className="text-xl md:text-3xl font-serif text-gray-200 mb-5 tracking-wide">Ingredients</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#2D2726] p-4 md:p-6 rounded-xl border border-[#3E3A37]">
                    {recipe.ingredients.map((item, idx) => (
                        <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-1 flex items-center justify-center shrink-0">
                                <input type="checkbox" className="peer appearance-none w-4.5 h-4.5 border-[1.5px] border-gray-400 rounded-sm checked:bg-[#FCE07A] checked:border-[#FCE07A] cursor-pointer transition" />
                                <svg className="absolute w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-sm md:text-[15px] text-gray-300 group-hover:text-white transition leading-snug break-words">
                                {item}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div className="mb-10">
                <h2 className="text-xl md:text-3xl font-serif text-gray-200 mb-6 tracking-wide">Instructions</h2>
                <div className="flex flex-col gap-6">
                    {recipe.instructions.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                            <span className="font-serif italic text-[#FCE07A] text-xl md:text-2xl opacity-50 shrink-0">
                                {idx + 1}
                            </span>
                            <p className="text-sm md:text-[15px] text-gray-300 leading-relaxed break-words">
                                {step}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}