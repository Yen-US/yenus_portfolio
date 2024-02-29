import { ReactNode } from "react";

interface TypoProps {
    children?: ReactNode;
}

export default function LinkTypo({ children }: TypoProps) {
    return (
        <a className="scroll-m-20 text-xl lg:text-2xl font-light tracking-tight cursor-pointer underline" href="https://notery-ai-simple-chat.vercel.app/" rel="noopener noreferrer" target="_blank">
            {children}
        </a>
    );
}