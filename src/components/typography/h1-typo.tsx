import { ReactNode } from "react";

interface TypoProps {
    children?: ReactNode;
}

export default function H1Typo({ children }: TypoProps) {
    return (
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-5xl">
            {children}
        </h1>
    );
}