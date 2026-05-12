"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategories: string[];
    toggleCategory: (category: string) => void;
    prepTime: string;
    setPrepTime: (time: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [prepTime, setPrepTime] = useState("");

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    return (
        <FilterContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                selectedCategories,
                toggleCategory,
                prepTime,
                setPrepTime,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
};