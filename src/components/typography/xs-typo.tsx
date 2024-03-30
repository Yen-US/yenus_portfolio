import { ReactNode } from "react";

interface TypoProps {
    children?: ReactNode;
}

export default function XsTypo({ children }: TypoProps) {
    return (
        <p className="text-xs font-light leading-none text-pretty my-2 text-stone-300">
            {children}
        </p>
    );
}