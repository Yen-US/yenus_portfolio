import { ReactNode } from "react";

interface TypoProps {
    children?: ReactNode;
}

export default function MutedTypo({ children }: TypoProps) {
    return (
        <p className="text-sm text-muted-foreground">
            {children}
        </p>
    );
}