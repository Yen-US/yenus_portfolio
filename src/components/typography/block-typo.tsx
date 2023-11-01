import { ReactNode } from "react";

interface TypoProps {
    children?: ReactNode;
}

export default function BlockTypo({ children }: TypoProps) {
    return (
        <blockquote className="mt-6 border-l-2 pl-6 italic">
            {children}
        </blockquote>
    );
}