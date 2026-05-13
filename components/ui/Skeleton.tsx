"use client";

interface SkeletonProps {
    className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`bg-[#4a4542] animate-pulse rounded-md ${className}`}
        />
    );
}