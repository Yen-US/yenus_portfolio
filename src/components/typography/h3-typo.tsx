import { ReactNode } from "react";

interface TypoProps {
    children?: ReactNode;
}

export default function H3Typo({ children }: TypoProps) {
    return (
        <h3 className="scroll-m-20 text-xl lg:text-2xl font-light tracking-tight">
            {children}
        </h3>
    );
}