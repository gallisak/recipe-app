export type RecipeCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert' | 'Beverage' | string;

export interface Ingredient {
    id?: string;
    value: string;
}

export interface Instruction {
    id?: string;
    value: string;
}

export interface Recipe {
    id: string;
    title: string;
    description: string;
    category: RecipeCategory;
    prepTime: number;
    rating: number;
    image: string;
    author: string;
    userId: string;
    ingredients: string[];
    instructions: string[];
    createdAt?: Date | string | any;
    updatedAt?: Date | string | any;
}

export interface RecipeFormData {
    title: string;
    description: string;
    category: RecipeCategory;
    prepTime: number;
    imageUrl: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
}