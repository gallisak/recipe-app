"use client";

import { useEffect, useState, use } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import IconButton from "@/components/ui/IconButton";

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

    if (initialLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-white">
                <Loader2 className="animate-spin text-[#FCE07A] mb-4" size={40} />
                <p className="text-gray-400">Loading recipe data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto text-white pb-10 px-4">
            <Button
                href={`/recipes/${id}`}
                variant="ghost"
                size="sm"
                icon={<ArrowLeft size={18} />}
                className="mb-6"
            >
                Cancel editing
            </Button>

            <h1 className="text-3xl font-bold mb-8">Edit Recipe</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-[#3A3633] p-6 md:p-8 rounded-2xl border border-[#4a4542]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <Input
                            label="Title"
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
                        />
                        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Category</label>
                        <select
                            {...register("category")}
                            className="w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A] text-white transition"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
                    </div>
                    <div>
                        <Input
                            type="number"
                            label="Prep Time (mins)"
                            error={errors.prepTime?.message}
                            {...register("prepTime")}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Ingredients</label>
                    {ingFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 mb-3 items-start">
                            <Input
                                error={(errors.ingredients as any)?.[index]?.value?.message}
                                {...register(`ingredients.${index}.value` as const)}
                            />
                            <IconButton
                                type="button"
                                variant="danger"
                                icon={<Trash2 size={20} />}
                                onClick={() => removeIng(index)}
                                className="mt-1"
                            />
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
                            <span className="flex items-center justify-center bg-[#262220] border border-[#4a4542] rounded-xl w-12 h-12 font-bold text-gray-400 shrink-0">
                                {index + 1}
                            </span>
                            <Input
                                error={(errors.instructions as any)?.[index]?.value?.message}
                                {...register(`instructions.${index}.value` as const)}
                            />
                            <IconButton
                                type="button"
                                variant="danger"
                                icon={<Trash2 size={20} />}
                                onClick={() => removeInst(index)}
                                className="mt-1"
                            />
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
                        isLoading={isUpdating}
                        className="px-10"
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}