"use client";

import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

const recipeSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description is too short"),
    category: z.string().min(1, "Select a category"),
    prepTime: z.coerce.number().min(1, "Prep time must be at least 1 minute"),
    ingredients: z.array(z.object({ value: z.string().min(1, "Required") })).min(1, "Add at least one ingredient"),
    instructions: z.array(z.object({ value: z.string().min(1, "Required") })).min(1, "Add at least one instruction"),
});

type RecipeForm = z.infer<typeof recipeSchema>;

const categories = ["Vegan", "Dessert", "Italian", "Breakfast", "Mexican", "Asian"];

export default function NewRecipePage() {
    const router = useRouter();
    const { user, profile } = useAuth();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { register, control, handleSubmit, formState: { errors } } = useForm<RecipeForm>({
        resolver: zodResolver(recipeSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            category: "",
            prepTime: 0,
            ingredients: [{ value: "" }],
            instructions: [{ value: "" }],
        }
    });

    const { fields: ingFields, append: addIng, remove: removeIng } = useFieldArray({ control, name: "ingredients" });
    const { fields: instFields, append: addInst, remove: removeInst } = useFieldArray({ control, name: "instructions" });

    const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
        if (!user) return alert("You must be logged in!");
        if (!imageFile) return alert("Please upload an image!");

        try {
            setIsUploading(true);
            const imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

            await addDoc(collection(db, "recipes"), {
                title: data.title,
                description: data.description,
                category: data.category,
                prepTime: data.prepTime,
                rating: 0,
                ingredients: data.ingredients.map(i => i.value),
                instructions: data.instructions.map(i => i.value),
                image: imageUrl,
                author: profile ? `${profile.firstName} ${profile.lastName}` : "Anonymous Chef",
                userId: user.uid,
                createdAt: serverTimestamp(),
            });

            router.push("/recipes");
        } catch (error) {
            console.error("Error creating recipe:", error);
            alert("Something went wrong!");
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

            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 bg-[#3A3633] p-8 rounded-2xl border border-[#4a4542]">

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
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Recipe Image</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#4a4542] border-dashed rounded-xl cursor-pointer bg-[#262220] hover:border-[#FCE07A] transition">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-400">
                                    {imageFile ? <span className="text-[#FCE07A] font-semibold">{imageFile.name}</span> : "Click to upload image"}
                                </p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Ingredients</label>
                    {ingFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 mb-3">
                            <div className="flex-1">
                                <input {...register(`ingredients.${index}.value` as const)} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" placeholder="e.g. 2 cups of flour" />

                                {(errors.ingredients as any)?.[index]?.value && <span className="text-red-400 text-xs mt-1">{(errors.ingredients as any)[index].value.message}</span>}
                            </div>
                            {ingFields.length > 1 && (
                                <button type="button" onClick={() => removeIng(index)} className="p-3 h-12.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition">
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={() => addIng({ value: "" })} className="text-[#FCE07A] text-sm font-semibold flex items-center gap-1 mt-2 hover:underline">
                        <Plus size={16} /> Add Ingredient
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Instructions</label>
                    {instFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 mb-3">
                            <span className="flex items-center justify-center bg-[#262220] border border-[#4a4542] rounded-xl w-12 h-12.5 font-bold text-gray-400">{index + 1}</span>
                            <div className="flex-1">
                                <input {...register(`instructions.${index}.value` as const)} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" placeholder="e.g. Mix the flour and sugar..." />

                                {(errors.instructions as any)?.[index]?.value && <span className="text-red-400 text-xs mt-1">{(errors.instructions as any)[index].value.message}</span>}
                            </div>
                            {instFields.length > 1 && (
                                <button type="button" onClick={() => removeInst(index)} className="p-3 h-12.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition">
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={() => addInst({ value: "" })} className="text-[#FCE07A] text-sm font-semibold flex items-center gap-1 mt-2 hover:underline">
                        <Plus size={16} /> Add Step
                    </button>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-[#4a4542] flex justify-end">
                    <button disabled={isUploading} type="submit" className="bg-[#FCE07A] text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50">
                        {isUploading ? "Publishing..." : "Publish Recipe"}
                    </button>
                </div>
            </form>
        </div>
    );
}