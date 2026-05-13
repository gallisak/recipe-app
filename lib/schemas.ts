import * as z from "zod";

export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInForm = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type SignUpForm = z.infer<typeof signUpSchema>;

export const newRecipeSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description is too short"),
    category: z.string().min(1, "Select a category"),
    prepTime: z.coerce.number().min(1, "Prep time must be at least 1 minute"),
    imageUrl: z.string().url("Please enter a valid image URL (starting with http/https)"),
    ingredients: z.array(z.object({ value: z.string().min(1, "Required") })).min(1, "Add at least one ingredient"),
    instructions: z.array(z.object({ value: z.string().min(1, "Required") })).min(1, "Add at least one instruction"),
});

export type NewRecipeForm = z.infer<typeof newRecipeSchema>;

export const editRecipeSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description is too short"),
    category: z.string().min(1, "Select a category"),
    prepTime: z.coerce.number().min(1, "Prep time must be at least 1 minute"),
    ingredients: z.array(z.object({ value: z.string().min(1, "Required") })),
    instructions: z.array(z.object({ value: z.string().min(1, "Required") })),
});

export type EditRecipeForm = z.infer<typeof editRecipeSchema>;
