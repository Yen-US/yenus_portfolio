import { ReactNode } from "react";
import Link from "next/link";
interface TypoProps {
    children?: ReactNode;
    href: string;
}

export default function LinkTypo({ children, href }: TypoProps) {
    return (
        <Link className="scroll-m-20 text-xl lg:text-2xl font-light tracking-tight cursor-pointer underline" href={href} rel="noopener noreferrer" target="blank">
            {children}
        </Link>
    );
}