import { Separator } from "@/components/ui/separator"
import H2Typo from "./typography/h2-typo"
import H3Typo from "./typography/h3-typo"
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
import TSSVG from "./icons/ts-icon"
import DockerSVG from "./icons/docker-icon"

export default function Skills() {
    return (
        <section className="text-xl flex flex-col lg:w-2/3 space-y-6 mb-2">
            <H2Typo>Skills</H2Typo>
            <H3Typo>Technical Skills</H3Typo>
            <article className="flex items-center flex-wrap justify-center mb-4">
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="React"><ReactSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Angular"><AngularSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Node"><NodeSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Express"><ExpressSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="PostgreSQL"><PSSQLSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Java"><JavaSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Linux"><LinuxSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Nginx"><NginxSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="JavaScript"><JSSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="TypeScript"><TSSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="NextJS"><NextSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="SQL"><SQLSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="API"><APISVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Jira & Project Management"><JiraSVG /></Badge>
                <Badge className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1" title="Docker"><DockerSVG /></Badge>
            </article>
            <Separator />
            <H3Typo>Soft Skills</H3Typo>
            <article className="flex items-center flex-wrap justify-center mb-4">
                <Badge className="hover:animate-pulse m-1" title="Growth Mindset">Growth Mindset</Badge>
                <Badge className="hover:animate-pulse m-1" title="Lean-Agile skills">Lean-Agile</Badge>
                <Badge className="hover:animate-pulse m-1" title="Adaptability">Adaptability</Badge>
                <Badge className="hover:animate-pulse m-1" title="Time Management">Time Management</Badge>
                <Badge className="hover:animate-pulse m-1" title="Work etiquette">Work etiquette</Badge>
                <Badge className="hover:animate-pulse m-1" title="Customer Focus">Customer Focus</Badge>
                <Badge className="hover:animate-pulse m-1" title="Leadership skills">Leadership</Badge>
                <Badge className="hover:animate-pulse m-1" title="Teamwork">Teamwork</Badge>
                <Badge className="hover:animate-pulse m-1" title="Presentation skills">Presentation</Badge>
                <Badge className="hover:animate-pulse m-1" title="Conflict Resolution skills">Conflict Resolution</Badge>
                <Badge className="hover:animate-pulse m-1" title="Empathy & Rapport">Empathy & Rapport</Badge>
                <Badge className="hover:animate-pulse m-1" title="Professional Communication">Professional Communication</Badge>
                <Badge className="hover:animate-pulse m-1" title="Cultural Sensitivity">Cultural Sensitivity</Badge>
                <Badge className="hover:animate-pulse m-1" title="Negotiation">Negotiation</Badge>
            </article>
        </section>
    )
}
