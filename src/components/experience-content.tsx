import { Separator } from "@/components/ui/separator"
import H2Typo from "./typography/h2-typo"
import H3Typo from "./typography/h3-typo"
import H4Typo from "./typography/h4-typo"
import STypo from "./typography/small-typo"
import MutedTypo from "./typography/muted-typo"
import { Badge } from "@/components/ui/badge"
import ReactSVG from "./icons/react-icon"
import NodeSVG from "./icons/node-icon"
import LinuxSVG from "./icons/linux-icon"
import AngularSVG from "./icons/angular-icon"
import ExpressSVG from "./icons/express-icon"
import NginxSVG from "./icons/nginx-icon"
import JavaSVG from "./icons/java-icon"
import JSSVG from "./icons/js-icon"
import NextSVG from "./icons/nextjs-icon"
import PSSQLSVG from "./icons/postgre-icon"
import SQLSVG from "./icons/sql-icon"
import APISVG from "./icons/api-icon"
import JiraSVG from "./icons/jira-icon"
import DockerSVG from "./icons/docker-icon"


export default function Experience() {
    return (
        <section className="text-xl flex flex-col lg:w-1/2 space-y-6 mb-2">
            <H2Typo>Experience</H2Typo>
            <section className="px-2 lg:px-10 flex justify-between items-center">
                <article className="w-1/2"> 
                    <H3Typo>Junior Software Tools Engineer</H3Typo>
                    <H4Typo>Wind River</H4Typo>
                    <STypo>San Jose, Costa Rica (WFH)</STypo>
                    <MutedTypo>2023 / 09 - Current</MutedTypo>
                </article>
                <aside className="flex items-center flex-wrap justify-end">
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="React"><ReactSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Angular"><AngularSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Node"><NodeSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Express"><ExpressSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="PostgreSQL"><PSSQLSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Java"><JavaSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Linux"><LinuxSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Nginx"><NginxSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Docker"><DockerSVG /></Badge>
                </aside>
            </section>
            <Separator></Separator>
            <section className="px-2 lg:px-10 flex justify-between items-center">
                <article className="w-1/2">
                    <H3Typo>Software Developer Internship</H3Typo>
                    <H4Typo>Wind River</H4Typo>
                    <STypo>San Jose, Costa Rica (WFH)</STypo>
                    <MutedTypo>2023 / 04 - 2023 / 09 </MutedTypo>
                </article>
                <aside className="flex items-center flex-wrap justify-end">
                    <Badge className="hover:animate-pulse m-1" title="Growth Mindset">Growth Mindset</Badge>
                    <Badge className="hover:animate-pulse m-1" title="Lean-Agile skills">Lean-Agile</Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="React"><ReactSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Linux"><LinuxSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Nginx"><NginxSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Docker"><DockerSVG /></Badge>

                </aside>
            </section>
            <Separator></Separator>
            <section className="px-2 lg:px-10 flex justify-between items-center">
                <article className="w-1/2">
                    <H3Typo>Technical Support Engineer <br /> Solutions Development Engineer</H3Typo>
                    <H4Typo>Onereach.ai</H4Typo>
                    <STypo>US (Remote)</STypo>
                    <MutedTypo>2022 / 10 - 2023 / 04 </MutedTypo>
                </article>
                <aside className="flex items-center flex-wrap justify-end">
                    <Badge className="hover:animate-pulse m-1" title="Adaptability">Adaptability</Badge>
                    <Badge className="hover:animate-pulse m-1" title="Time Management">Time Management</Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="JavaScript"><JSSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="NextJS"><NextSVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="SQL"><SQLSVG /></Badge>
                </aside>
            </section>
            <Separator></Separator>
            <section className="px-2 lg:px-10 flex justify-between items-center">
                <article className="w-1/2">
                    <H3Typo>Technical Support Engineer</H3Typo>
                    <H4Typo>Wrike</H4Typo>
                    <STypo>Heredia, Costa Rica (WFH)</STypo>
                    <MutedTypo>2022 / 02 - 2023 / 04 </MutedTypo>
                </article>
                <aside className="flex items-center flex-wrap justify-end">
                    <Badge className="hover:animate-pulse m-1" title="Work etiquette">Work etiquette</Badge>
                    <Badge className="hover:animate-pulse m-1" title="Customer Focus">Customer Focus</Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="API"><APISVG /></Badge>
                    <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Jira & Project Management"><JiraSVG /></Badge>
                </aside>
            </section>
            <Separator></Separator>
            <section className="px-2 lg:px-10 flex justify-between items-center">
                <article className="w-1/2">
                    <H3Typo>Tier 2, Technical Support Engineer, SME</H3Typo>
                    <H4Typo>DocuSign (Sitel)</H4Typo>
                    <STypo>San Jose, Costa Rica (WFH)</STypo>
                    <MutedTypo>2021 / 01 - 2022 / 02</MutedTypo>
                </article>
                <aside className="flex items-center flex-wrap justify-end">
                    <Badge className="hover:animate-pulse m-1" title="Leadership skills">Leadership</Badge>
                    <Badge className="hover:animate-pulse m-1" title="Teamwork">Teamwork</Badge>
                    <Badge className="hover:animate-pulse m-1" title="Presentation skills">Presentation</Badge>
                    <Badge className="hover:animate-pulse m-1" title="Conflict Resolution skills">Conflict Resolution</Badge>
                </aside>
            </section>
            <Separator></Separator>
            <section className="px-2 lg:px-10 flex justify-between items-center">
                <article className="w-1/2">
                    <H3Typo>Customer Service Advisor</H3Typo>
                    <H4Typo>Santander bank (Concentrix)</H4Typo>
                    <STypo>Heredia, Costa Rica</STypo>
                    <MutedTypo>2020 / 10 - 2021 / 01</MutedTypo>
                </article>
                <aside className="flex items-center flex-wrap justify-end">
                    <Badge className="hover:animate-pulse m-1" title="Empathy & Rapport">Empathy & Rapport</Badge>
                    <Badge className="hover:animate-pulse m-1" title="Professional Communication">Professional Communication</Badge>
                    <Badge className="hover:animate-pulse m-1" title="Cultural Sensitivity">Cultural Sensitivity</Badge>
                    <Badge className="hover:animate-pulse m-1" title="Negotiation">Negotiation</Badge>
                </aside>
            </section>
        </section>
    )
}
