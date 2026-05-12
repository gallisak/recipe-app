const categories = ["Vegan", "Dessert", "Italian", "Breakfast", "Mexican", "Asian"];
const prepTimes = ["Under 15 mins", "15-30 mins", "30-60 mins", "Over 1 hr"];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-[#2D2726] text-white p-8 border-r border-[#3E3A37] h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
            <div className="flex flex-col gap-10">
                {/* Category Filter */}
                <div>
                    <h3 className="font-semibold mb-5 text-[15px]">Filter by Category</h3>
                    <div className="flex flex-col gap-4">
                        {categories.map((cat) => (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input type="checkbox" className="peer appearance-none w-4 h-4 border border-gray-500 rounded-sm checked:bg-[#FCE07A] checked:border-[#FCE07A] cursor-pointer transition" />
                                    <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-gray-300 text-sm group-hover:text-white transition">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Prep Time Filter */}
                <div>
                    <h3 className="font-semibold mb-5 text-[15px]">Filter by Prep Time</h3>
                    <div className="flex flex-col gap-4">
                        {prepTimes.map((time) => (
                            <label key={time} className="flex items-center gap-3 cursor-pointer group">
                                <input type="radio" name="prepTime" className="w-4 h-4 appearance-none border border-gray-500 rounded-full checked:border-4 checked:border-[#FCE07A] cursor-pointer transition" />
                                <span className="text-gray-300 text-sm group-hover:text-white transition">{time}</span>
                            </label>
                        ))}

                        {/* Custom Time */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="prepTime" className="w-4 h-4 appearance-none border border-gray-500 rounded-full checked:border-4 checked:border-[#FCE07A] cursor-pointer transition" />
                            <span className="text-gray-300 text-sm group-hover:text-white transition">Custom</span>
                        </label>
                        <div className="flex items-center gap-2 pl-7 -mt-2">
                            <input type="number" placeholder="Min" className="w-16 bg-[#3E3A37] border border-gray-600 rounded px-2 py-1 text-xs text-white outline-none focus:border-[#FCE07A]" />
                            <span className="text-gray-500 text-xs">to</span>
                            <input type="number" placeholder="Max" className="w-16 bg-[#3E3A37] border border-gray-600 rounded px-2 py-1 text-xs text-white outline-none focus:border-[#FCE07A]" />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}