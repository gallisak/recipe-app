"use client";

import { useEffect, useState, use } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

const recipeSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description is too short"),
    category: z.string().min(1, "Select a category"),
    prepTime: z.coerce.number().min(1, "Prep time must be at least 1 minute"),
    ingredients: z.array(z.object({ value: z.string().min(1, "Required") })),
    instructions: z.array(z.object({ value: z.string().min(1, "Required") })),
});

type RecipeForm = z.infer<typeof recipeSchema>;
const categories = ["Vegan", "Dessert", "Italian", "Breakfast", "Mexican", "Asian"];

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<RecipeForm>({
        resolver: zodResolver(recipeSchema) as any,
    });

    const { fields: ingFields, append: addIng, remove: removeIng } = useFieldArray({ control, name: "ingredients" });
    const { fields: instFields, append: addInst, remove: removeInst } = useFieldArray({ control, name: "instructions" });

    useEffect(() => {
        const loadRecipe = async () => {
            const docSnap = await getDoc(doc(db, "recipes", id));
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.userId !== user?.uid) {
                    alert("You can only edit your own recipes!");
                    router.push("/recipes");
                    return;
                }
                reset({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    prepTime: data.prepTime,
                    ingredients: data.ingredients.map((v: string) => ({ value: v })),
                    instructions: data.instructions.map((v: string) => ({ value: v })),
                });
            }
            setInitialLoading(false);
        };
        if (user) loadRecipe();
    }, [id, user, reset, router]);

    const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
        try {
            setIsUpdating(true);
            const recipeRef = doc(db, "recipes", id);

            await updateDoc(recipeRef, {
                title: data.title,
                description: data.description,
                category: data.category,
                prepTime: data.prepTime,
                ingredients: data.ingredients.map(i => i.value),
                instructions: data.instructions.map(i => i.value),
            });

            router.push(`/recipes/${id}`);
        } catch (error) {
            console.error(error);
            alert("Error updating recipe");
        } finally {
            setIsUpdating(false);
        }
    };

    if (initialLoading) return <div className="text-white p-10 text-center">Loading recipe data...</div>;

    return (
        <div className="max-w-3xl mx-auto text-white pb-10">
            <Link href={`/recipes/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FCE07A] transition mb-6">
                <ArrowLeft size={20} /> Cancel editing
            </Link>

            <h1 className="text-3xl font-bold mb-8">Edit Recipe</h1>

            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 bg-[#3A3633] p-8 rounded-2xl border border-[#4a4542]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Title</label>
                        <input {...register("title")} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
                        <textarea {...register("description")} rows={3} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Category</label>
                        <select {...register("category")} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Prep Time</label>
                        <input type="number" {...register("prepTime")} className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Ingredients</label>
                    {ingFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 mb-3">
                            <input {...register(`ingredients.${index}.value` as const)} className="flex-1 bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" />
                            <button type="button" onClick={() => removeIng(index)} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20"><Trash2 size={20} /></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addIng({ value: "" })} className="text-[#FCE07A] text-sm font-semibold flex items-center gap-1 mt-2 hover:underline"><Plus size={16} /> Add Ingredient</button>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Instructions</label>
                    {instFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 mb-3">
                            <span className="flex items-center justify-center bg-[#262220] border border-[#4a4542] rounded-xl w-12 h-12.5 font-bold text-gray-400">{index + 1}</span>
                            <input {...register(`instructions.${index}.value` as const)} className="flex-1 bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A]" />
                            <button type="button" onClick={() => removeInst(index)} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20"><Trash2 size={20} /></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addInst({ value: "" })} className="text-[#FCE07A] text-sm font-semibold flex items-center gap-1 mt-2 hover:underline"><Plus size={16} /> Add Step</button>
                </div>

                <div className="pt-4 border-t border-[#4a4542] flex justify-end">
                    <button disabled={isUpdating} type="submit" className="bg-[#FCE07A] text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50">
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}