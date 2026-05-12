"use client";

import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Link as LinkIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

const recipeSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description is too short"),
    category: z.string().min(1, "Select a category"),
    prepTime: z.coerce.number().min(1, "Prep time must be at least 1 minute"),
    imageUrl: z.string().url("Please enter a valid image URL (starting with http/https)"),
    ingredients: z.array(z.object({ value: z.string().min(1, "Required") })).min(1, "Add at least one ingredient"),
    instructions: z.array(z.object({ value: z.string().min(1, "Required") })).min(1, "Add at least one instruction"),
});

type RecipeForm = z.infer<typeof recipeSchema>;

const categories = ["Vegan", "Dessert", "Italian", "Breakfast", "Mexican", "Asian"];

export default function NewRecipePage() {
    const router = useRouter();
    const { user, profile } = useAuth();
    const [isUploading, setIsUploading] = useState(false);

    const { register, control, handleSubmit, formState: { errors } } = useForm<RecipeForm>({
        resolver: zodResolver(recipeSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            category: "",
            prepTime: 0,
            imageUrl: "",
            ingredients: [{ value: "" }],
            instructions: [{ value: "" }],
        }
    });

    const { fields: ingFields, append: addIng, remove: removeIng } = useFieldArray({ control, name: "ingredients" });
    const { fields: instFields, append: addInst, remove: removeInst } = useFieldArray({ control, name: "instructions" });

    const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
        if (!user) return alert("You must be logged in!");

        try {
            setIsUploading(true);

            await addDoc(collection(db, "recipes"), {
                title: data.title,
                description: data.description,
                category: data.category,
                prepTime: data.prepTime,
                rating: 0,
                ingredients: data.ingredients.map(i => i.value),
                instructions: data.instructions.map(i => i.value),
                image: data.imageUrl,
                author: profile ? `${profile.firstName} ${profile.lastName}` : "Anonymous Chef",
                userId: user.uid,
                createdAt: serverTimestamp(),
            });

            router.push("/recipes");
        } catch (error) {
            console.error("Error creating recipe:", error);
            alert("Permission denied. Make sure you are logged in and Firestore Rules are set to public write.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto text-white pb-10">
            <Link href="/recipes" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FCE07A] transition mb-6">
                <ArrowLeft size={20} /> Back to recipes
            </Link>

            <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-[#3A3633] p-8 rounded-2xl border border-[#4a4542]">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Recipe Title</label>
                        <input {...register("title")} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" placeholder="e.g. Pasta Carbonara" />
                        {errors.title && <span className="text-red-400 text-xs mt-1">{errors.title.message}</span>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
                        <textarea {...register("description")} rows={3} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" placeholder="Short introduction..." />
                        {errors.description && <span className="text-red-400 text-xs mt-1">{errors.description.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Category</label>
                        <select {...register("category")} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]">
                            <option value="">Select category...</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.category && <span className="text-red-400 text-xs mt-1">{errors.category.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Prep Time (minutes)</label>
                        <input type="number" {...register("prepTime")} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" placeholder="e.g. 45" />
                        {errors.prepTime && <span className="text-red-400 text-xs mt-1">{errors.prepTime.message}</span>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Recipe Image URL</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <LinkIcon size={18} />
                        </div>
                        <input
                            {...register("imageUrl")}
                            className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 pl-10 outline-none focus:border-[#FCE07A]"
                            placeholder="https://images.unsplash.com/photo-..."
                        />
                    </div>
                    {errors.imageUrl && <span className="text-red-400 text-xs mt-1">{errors.imageUrl.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Ingredients</label>
                    {ingFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 mb-3">
                            <div className="flex-1">
                                <input {...register(`ingredients.${index}.value` as const)} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" placeholder="e.g. 2 cups of flour" />
                            </div>
                            {ingFields.length > 1 && (
                                <button type="button" onClick={() => removeIng(index)} className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition">
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={() => addIng({ value: "" })} className="text-[#FCE07A] text-sm font-semibold flex items-center gap-1 mt-2">
                        <Plus size={16} /> Add Ingredient
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Instructions</label>
                    {instFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 mb-3">
                            <span className="flex items-center justify-center bg-[#262220] border border-[#4a4542] rounded-xl w-12 h-12 font-bold text-gray-500">{index + 1}</span>
                            <div className="flex-1">
                                <input {...register(`instructions.${index}.value` as const)} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" placeholder="Step description..." />
                            </div>
                            {instFields.length > 1 && (
                                <button type="button" onClick={() => removeInst(index)} className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition">
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={() => addInst({ value: "" })} className="text-[#FCE07A] text-sm font-semibold flex items-center gap-1 mt-2">
                        <Plus size={16} /> Add Step
                    </button>
                </div>

                <div className="pt-4 border-t border-[#4a4542] flex justify-end">
                    <button disabled={isUploading} type="submit" className="bg-[#FCE07A] text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50">
                        {isUploading ? "Publishing..." : "Publish Recipe"}
                    </button>
                </div>
            </form>
        </div>
    );
}