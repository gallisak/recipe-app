"use client";

import { useFilter } from "@/contexts/FilterContext";
import { Heart } from "lucide-react";
import Button from "@/components/ui/Button";

const categories = ["Vegan", "Dessert", "Italian", "Breakfast", "Mexican", "Asian"];
const prepTimes = ["Under 15 mins", "15-30 mins", "30-60 mins", "Over 1 hr"];

export default function Sidebar() {
    const {
        selectedCategories,
        toggleCategory,
        setSelectedCategories,
        prepTime,
        setPrepTime,
        showFavorites,
        setShowFavorites
    } = useFilter();

    return (
        <aside className="w-64 bg-[#262220] text-white p-8 border-r border-[#3E3A37] h-[calc(100vh-80px)] sticky top-20 overflow-y-auto hidden lg:block">
            <div className="flex flex-col gap-10">

                <div>
                    <Button
                        variant={showFavorites ? "primary" : "secondary"}
                        onClick={() => setShowFavorites(!showFavorites)}
                        className="w-full justify-start"
                        icon={<Heart size={20} className={showFavorites ? 'fill-black' : 'text-gray-400'} />}
                    >
                        Saved Recipes
                    </Button>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-[15px]">Filter by Category</h3>
                        {selectedCategories.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCategories([])}
                                className="h-auto p-0 font-normal text-xs text-gray-500 hover:bg-transparent"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        {categories.map((cat) => (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => toggleCategory(cat)}
                                        className="peer appearance-none w-4 h-4 border border-gray-500 rounded-sm checked:bg-[#FCE07A] checked:border-[#FCE07A] cursor-pointer transition"
                                    />
                                    <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-gray-300 text-sm group-hover:text-white transition">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-[15px]">Filter by Prep Time</h3>
                        {prepTime && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPrepTime("")}
                                className="h-auto p-0 font-normal text-xs text-gray-500 hover:bg-transparent"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        {prepTimes.map((time) => (
                            <label key={time} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="prepTime"
                                    checked={prepTime === time}
                                    onChange={() => setPrepTime(time)}
                                    className="w-4 h-4 appearance-none border border-gray-500 rounded-full checked:border-4 checked:border-[#FCE07A] cursor-pointer transition"
                                />
                                <span className="text-gray-300 text-sm group-hover:text-white transition">{time}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}