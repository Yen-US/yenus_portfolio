import H2Typo from "./typography/h2-typo"
import H4Typo from "./typography/h4-typo"
import STypo from "./typography/small-typo"
import MutedTypo from "./typography/muted-typo"
import { Badge } from "@/components/ui/badge"
import ReactSVG from "./icons/react-icon"
import NextSVG from "./icons/nextjs-icon"
import TSSVG from "./icons/ts-icon"
import LinkTypo from "./typography/link-typo"

export default function Projects() {
    return (
        <section className="text-xl flex flex-col lg:w-1/2 space-y-6 mb-2">
            <H2Typo>Side Projects</H2Typo>
            <section className="px-2 lg:px-10 flex justify-between items-center">
                <article className="w-1/2"> 
                    <LinkTypo>Notery.ai</LinkTypo>
                    <H4Typo>Full Stack Project</H4Typo>
                    <STypo>Personal chat GPT like tool, focused on improving notes, Open source and completely free.</STypo>
                    <MutedTypo>2024 / 01 - Current</MutedTypo>
                </article>
                <aside className="flex items-center flex-wrap justify-end">
                    <Badge className="hover:animate-pulse m-1" title="Simple chat">Simple chat</Badge>
                    <Badge className="hover:animate-pulse m-1" title="Simple chat">v1.0</Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="React"><ReactSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Nextjs"><NextSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="TypeScript"><TSSVG /></Badge>

                </aside>
            </section>
        </section>
    )
}
