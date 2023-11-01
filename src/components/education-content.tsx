import { Separator } from "@/components/ui/separator"
import H2Typo from "./typography/h2-typo"
import H3Typo from "./typography/h3-typo"
import H4Typo from "./typography/h4-typo"
import STypo from "./typography/small-typo"
import MutedTypo from "./typography/muted-typo"

export default function Education() {
    return (
        <section className="text-xl flex flex-col w-2/3 space-y-6">
            <H2Typo>Education</H2Typo>
            <section className="px-10 flex justify-between">
                <article>
                    <H3Typo>Computer Engineer</H3Typo>
                    <H4Typo>Technological Institute of Costa Rica (TEC)</H4Typo>
                    <STypo>Cartago, Costa Rica</STypo>
                    <MutedTypo>2018 - In progress</MutedTypo>
                </article>
            </section>
            <Separator></Separator>
            <article className="pl-10">
                <H3Typo>Python I</H3Typo>
                <H4Typo>SITEL Technical Academy</H4Typo>
                <STypo>Heredia, Costa Rica</STypo>
                <MutedTypo>2021 - 2021</MutedTypo>
            </article>
            <Separator></Separator>
            <article className="pl-10">
                <H3Typo>CISCO IT Essentials</H3Typo>
                <H4Typo>SITEL Technical Academy</H4Typo>
                <STypo>Heredia, Costa Rica</STypo>
                <MutedTypo>2021 - 2021</MutedTypo>
            </article>
            <Separator></Separator>
            <article className="pl-10">
                <H3Typo>High School Diploma</H3Typo>
                <H4Typo>Santa Maria De Guadalupe School</H4Typo>
                <STypo>Heredia, Costa Rica</STypo>
                <MutedTypo>2013 - 2017</MutedTypo>
            </article>
        </section>
    )
}
