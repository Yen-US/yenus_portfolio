import { ReactNode } from "react";

interface TypoProps {
    children?: ReactNode;
}

export default function ParaTypo({ children }: TypoProps) {
    return (
        <p className="leading-7 [&:not(:first-child)]:mt-6">
            {children}
        </p>
    );
}