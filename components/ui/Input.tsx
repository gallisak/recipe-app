"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold mb-2 text-gray-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`w-full bg-[#262220] border border-[#4a4542] rounded-xl p-3 outline-none focus:border-[#FCE07A] text-white transition ${error ? "border-red-400" : ""
                        } ${className}`}
                    {...props}
                />
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";