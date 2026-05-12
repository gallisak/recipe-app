"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
    selectedCategories: string[];
    toggleCategory: (category: string) => void;
    setSelectedCategories: (categories: string[]) => void;
    prepTime: string;
    setPrepTime: (time: string) => void;
    showFavorites: boolean;
    setShowFavorites: (show: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [prepTime, setPrepTime] = useState<string>("");
    const [showFavorites, setShowFavorites] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Функція для перемикання окремої категорії
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
                selectedCategories,
                toggleCategory,
                setSelectedCategories,
                prepTime,
                setPrepTime,
                showFavorites,
                setShowFavorites,
                searchQuery,
                setSearchQuery,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export function useFilter() {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
}