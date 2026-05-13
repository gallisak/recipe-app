"use client";

import Skeleton from "./Skeleton";
import Card from "./Card";

export default function RecipeCardSkeleton() {
    return (
        <Card className="flex flex-col h-full">
            <Skeleton className="h-48 w-full rounded-none" />

            <div className="p-5 flex flex-col flex-1 space-y-4">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-10" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                <Skeleton className="h-3 w-1/4" />

                <div className="mt-auto flex items-center justify-between pt-2">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
            </div>
        </Card>
    );
}