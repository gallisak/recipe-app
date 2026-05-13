"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    icon?: ReactNode;
    href?: string;
    className?: string;
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    icon,
    href,
    className = "",
    disabled,
    ...props
}: ButtonProps) {

    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-[#FCE07A] text-black hover:bg-yellow-400",
        secondary: "bg-[#3A3633] text-white border border-[#4a4542] hover:bg-[#4a4542]",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-4 text-lg",
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedClassName}>
                {icon && !isLoading && <span>{icon}</span>}
                {children}
            </Link>
        );
    }

    return (
        <button
            className={combinedClassName}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
            ) : (
                icon && <span>{icon}</span>
            )}
            {children}
        </button>
    );
}