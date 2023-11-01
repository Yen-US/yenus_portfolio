import { ReactNode } from "react";

interface TypoProps {
    children?: ReactNode;
}

export default function LTypo({ children }: TypoProps) {
    return (
        <div className="text-lg font-semibold">
            {children}
        </div>
    );
}