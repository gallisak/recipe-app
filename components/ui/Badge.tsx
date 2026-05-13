"use client";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "primary" | "outline";
}

export default function Badge({ children, variant = "primary" }: BadgeProps) {
    const styles = variant === "primary"
        ? "bg-[#FCE07A] text-black"
        : "border border-[#4a4542] text-gray-400";

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles}`}>
            {children}
        </span>
    );
}