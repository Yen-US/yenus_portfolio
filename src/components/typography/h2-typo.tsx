import { ReactNode } from "react";

interface TypoProps {
    children?: ReactNode;
}

export default function H2Typo({ children }: TypoProps) {
    return (
        <h2 className="scroll-m-20 border-b pb-2 text-2xl lg:text-3xl font-semibold tracking-tight first:mt-0">
            {children}
        </h2>
    );
}