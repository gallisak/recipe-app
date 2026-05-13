"use client";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-[#3A3633] border border-[#4a4542] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#FCE07A]/50 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </div>
    );
}