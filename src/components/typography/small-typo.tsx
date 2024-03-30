import { ReactNode } from "react";

interface TypoProps {
    children?: ReactNode;
}

export default function STypo({ children }: TypoProps) {
    return (
        <small className="text-sm font-light leading-none text-balance">
            {children}
        </small>
    );
}