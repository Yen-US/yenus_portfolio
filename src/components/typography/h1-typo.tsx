import { ReactNode } from "react";
import { GeistSans } from 'geist/font'

interface TypoProps {
    children?: ReactNode;
}

export default function H1Typo({ children }: TypoProps) {
    return (
        <h1 className="scroll-m-20 text-3xl tracking-tight lg:text-5xl font-medium">
            {children}
        </h1>
    );
}