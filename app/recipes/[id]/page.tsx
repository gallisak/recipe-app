"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

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
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white animate-pulse">
                <Loader2 className="animate-spin text-[#FCE07A] mb-4" size={40} />
                <p className="text-gray-400">Loading recipe details...</p>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="text-center py-20">
                <h1 className="text-white text-2xl font-bold mb-4">Recipe not found</h1>
                <Button href="/recipes" variant="secondary">Go back to recipes</Button>
            </div>
        );
    }

    const publishDate = recipe.createdAt?.toDate
        ? recipe.createdAt.toDate().toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })
        : "October 15, 2023";

    return (
        <div className="text-[#D5D0C8] max-w-212.5 mx-auto pb-24 px-4 sm:px-6 lg:px-0 overflow-x-hidden">

            <div className="mb-6 md:mb-8 pt-4">
                <Button
                    variant="secondary"
                    size="sm"
                    href="/recipes"
                    icon={<ArrowLeft size={16} />}
                >
                    Back
                </Button>
            </div>

            <div className="mb-3">
                <Badge variant="primary">{recipe.category || "General"}</Badge>
            </div>

            <h1 className="text-2xl md:text-5xl font-serif font-medium text-white mb-4 tracking-wide leading-tight wrap-break-words">
                {recipe.title}
            </h1>

            <p className="text-gray-300 text-sm md:text-lg mb-8 leading-relaxed wrap-break-words">
                {recipe.description}
            </p>

            <div className="w-full mb-3 overflow-hidden rounded-2xl bg-[#3A3633] border border-[#4a4542]">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-auto min-h-50 max-h-125 object-cover block shadow-2xl"
                />
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 mb-8 italic">
                Freshly prepared {recipe.title.toLowerCase()} — ready to be served.
            </p>

            <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#3E3A37] pb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 border border-[#4a4542]">
                        <img
                            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-[13px] leading-tight">{recipe.author}</span>
                        <span className="text-[11px] text-gray-500">Professional Chef</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline">{recipe.prepTime} mins</Badge>
                    <p className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-tight">{publishDate}</p>
                </div>
            </div>

            <div className="space-y-12">
                <section>
                    <h2 className="text-xl md:text-3xl font-serif text-gray-200 mb-4 tracking-wide">Introduction</h2>
                    <p className="text-gray-300 text-sm md:text-[15px] leading-relaxed wrap-break-words">
                        This {recipe.title.toLowerCase()} is a curated masterpiece. It perfectly balances texture and flavor, making it a staple for anyone looking to impress at the dining table. Simple enough for a weeknight, but sophisticated enough for guests.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl md:text-3xl font-serif text-gray-200 mb-5 tracking-wide">Ingredients</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#2D2726] p-5 md:p-8 rounded-2xl border border-[#3E3A37] shadow-inner">
                        {recipe.ingredients.map((item, idx) => (
                            <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative mt-1 flex items-center justify-center shrink-0">
                                    <input
                                        type="checkbox"
                                        className="peer appearance-none w-5 h-5 border-[1.5px] border-gray-500 rounded-md checked:bg-[#FCE07A] checked:border-[#FCE07A] cursor-pointer transition-all"
                                    />
                                    <svg className="absolute w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-sm md:text-[15px] text-gray-300 group-hover:text-white transition leading-snug wrap-break-words pt-0.5">
                                    {item}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl md:text-3xl font-serif text-gray-200 mb-6 tracking-wide">Instructions</h2>
                    <div className="flex flex-col gap-8">
                        {recipe.instructions.map((step, idx) => (
                            <div key={idx} className="flex gap-5">
                                <span className="font-serif italic text-[#FCE07A] text-2xl md:text-3xl opacity-40 shrink-0 -mt-1">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                <p className="text-sm md:text-[15px] text-gray-300 leading-relaxed wrap-break-words pt-1">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}