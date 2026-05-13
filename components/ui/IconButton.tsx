"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    active?: boolean;
    variant?: "default" | "danger" | "success";
    className?: string;
}

export default function IconButton({
    icon,
    active,
    variant = "default",
    className = "",
    ...props
}: IconButtonProps) {

    const variants = {
        default: active ? "text-[#FCE07A] bg-[#FCE07A]/10" : "text-gray-400 hover:text-white bg-transparent",
        danger: "text-red-400 hover:bg-red-500/10",
        success: "text-green-400 hover:bg-green-500/10",
    };

    return (
        <button
            className={`p-2 rounded-full transition-all duration-200 active:scale-125 ${variants[variant]} ${className}`}
            {...props}
        >
            {icon}
        </button>
    );
}