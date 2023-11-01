import { Separator } from "@/components/ui/separator"
import H2Typo from "./typography/h2-typo"
import H3Typo from "./typography/h3-typo"
import H4Typo from "./typography/h4-typo"
import STypo from "./typography/small-typo"
import MutedTypo from "./typography/muted-typo"
import { Badge } from "@/components/ui/badge"
import ReactSVG from "./icons/react-icon"
import NodeSVG from "./icons/node-icon"


export default function Experience() {
    return (
        <section className="text-xl flex flex-col w-2/3 space-y-6 mb-2">
            <H2Typo>Experience</H2Typo>
            <section className="px-10 flex justify-between">
                <article>
                    <H3Typo>Junior Software Tools Engineer</H3Typo>
                    <H4Typo>Wind River</H4Typo>
                    <STypo>San Jose, Costa Rica (WFH)</STypo>
                    <MutedTypo>2023 / 09 - Current</MutedTypo>
                </article>
                <aside className="space-x-2">
                    <Badge className="p-0.5 group/react hover:bg-transparent hover:animate-pulse" title="Node"><NodeSVG fill="dark:fill-black fill-white group-hover/react:fill-[#8CC84B]"/></Badge>
                    <Badge className="p-0.5 group/react hover:bg-transparent hover:animate-pulse" title="React"><ReactSVG fill="dark:fill-black fill-white group-hover/react:fill-[#00d8ff]"/></Badge>
                    <Badge>Java</Badge>
                    <Badge>Linux</Badge>
                    <Badge>Nginx</Badge>
                    <Badge>Express</Badge>
                </aside>
            </section>
            <Separator></Separator>
            <article className="pl-10">
                <H3Typo>Software Developer Internship</H3Typo>
                <H4Typo>Wind River</H4Typo>
                <STypo>San Jose, Costa Rica (WFH)</STypo>
                <MutedTypo>2023 / 04 - 2023 / 09 </MutedTypo>
            </article>
            <Separator></Separator>
            <article className="pl-10">
                <H3Typo>Technical Support Engineer</H3Typo>
                <H4Typo>Wrike</H4Typo>
                <STypo>Heredia, Costa Rica (WFH)</STypo>
                <MutedTypo>2022 / 02 - 2023 / 04 </MutedTypo>
            </article>
            <Separator></Separator>
            <article className="pl-10">
                <H3Typo>Tier 2, Technical Support Engineer, SME</H3Typo>
                <H4Typo>DocuSign (Sitel)</H4Typo>
                <STypo>San Jose, Costa Rica (WFH)</STypo>
                <MutedTypo>2021 / 01 - 2022 / 02</MutedTypo>
            </article>
            <Separator></Separator>
            <article className="pl-10">
                <H3Typo>Customer Service Advisor</H3Typo>
                <H4Typo>Santander bank (Concentrix)</H4Typo>
                <STypo>Heredia, Costa Rica</STypo>
                <MutedTypo>2020 / 10 - 2021 / 01</MutedTypo>
            </article>
        </section>
    )
}
