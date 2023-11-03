import { ReactNode } from "react";

interface TypoProps {
    children?: ReactNode;
}

export default function H4Typo({ children }: TypoProps) {
    return (
        <h4 className="scroll-m-20 text-lg lg:text-xl font-semibold tracking-tight">
            {children}
        </h4>
    );
}