import RecipeCard from "@/components/RecipeCard";
import { ChevronDown } from "lucide-react";

export default function RecipesPage() {
    return (
        <div className="text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Pasta Carbonara</h1>
                    <p className="text-gray-400 text-sm mt-1">12345 recipes found</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
            </div>

            <div className="flex items-center gap-2 mt-10">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FCE07A] text-black font-bold text-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[#3A3633] font-bold text-sm transition">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[#3A3633] font-bold text-sm transition">3</button>
                <span className="text-gray-500">...</span>
            </div>
        </div>
    );
}