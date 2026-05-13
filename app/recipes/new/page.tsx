"use client";

import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Link as LinkIcon, ArrowLeft } from "lucide-react";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import IconButton from "@/components/ui/IconButton";
import { newRecipeSchema as recipeSchema, NewRecipeForm as RecipeForm } from "@/lib/schemas";

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
            alert("Permission denied. Check your Firestore Rules.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto text-white pb-10">
            <Button
                href="/recipes"
                variant="ghost"
                size="sm"
                icon={<ArrowLeft size={18} />}
                className="mb-6"
            >
                Back to recipes
            </Button>

            <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-[#3A3633] p-8 rounded-2xl border border-[#4a4542]">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <Input
                            label="Recipe Title"
                            placeholder="e.g. Pasta Carbonara"
                            error={errors.title?.message}
                            {...register("title")}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            className={`w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A] text-white transition ${errors.description ? "border-red-400" : ""}`}
                            placeholder="Short introduction..."
                        />
                        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Category</label>
                        <select
                            {...register("category")}
                            className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A] text-white transition"
                        >
                            <option value="">Select category...</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
                    </div>

                    <div>
                        <Input
                            type="number"
                            label="Prep Time (minutes)"
                            placeholder="e.g. 45"
                            error={errors.prepTime?.message}
                            {...register("prepTime")}
                        />
                    </div>
                </div>

                <Input
                    label="Recipe Image URL"
                    placeholder="https://images.unsplash.com/photo-..."
                    error={errors.imageUrl?.message}
                    {...register("imageUrl")}
                />

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Ingredients</label>
                    {ingFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 mb-3 items-start">
                            <Input
                                placeholder="e.g. 2 cups of flour"
                                error={(errors.ingredients as any)?.[index]?.value?.message}
                                {...register(`ingredients.${index}.value` as const)}
                            />
                            {ingFields.length > 1 && (
                                <IconButton
                                    type="button"
                                    variant="danger"
                                    icon={<Trash2 size={20} />}
                                    onClick={() => removeIng(index)}
                                    className="mt-1"
                                />
                            )}
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={<Plus size={16} />}
                        onClick={() => addIng({ value: "" })}
                    >
                        Add Ingredient
                    </Button>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Instructions</label>
                    {instFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 mb-3 items-start">
                            <span className="flex items-center justify-center bg-[#262220] border border-[#4a4542] rounded-xl w-12 h-12 font-bold text-gray-500 shrink-0">
                                {index + 1}
                            </span>
                            <Input
                                placeholder="Step description..."
                                error={(errors.instructions as any)?.[index]?.value?.message}
                                {...register(`instructions.${index}.value` as const)}
                            />
                            {instFields.length > 1 && (
                                <IconButton
                                    type="button"
                                    variant="danger"
                                    icon={<Trash2 size={20} />}
                                    onClick={() => removeInst(index)}
                                    className="mt-1"
                                />
                            )}
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={<Plus size={16} />}
                        onClick={() => addInst({ value: "" })}
                    >
                        Add Step
                    </Button>
                </div>

                <div className="pt-4 border-t border-[#4a4542] flex justify-end">
                    <Button
                        type="submit"
                        isLoading={isUploading}
                        className="px-10"
                    >
                        Publish Recipe
                    </Button>
                </div>
            </form>
        </div>
    );
}