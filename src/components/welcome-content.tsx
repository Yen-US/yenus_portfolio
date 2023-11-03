import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import H1Typo from "./typography/h1-typo"
import H2Typo from "./typography/h2-typo"
import { Button } from "./ui/button"
import LinkedinSVG from "./icons/linkedin-icon"
import GitSVG from "./icons/github-icon"
import CVSVG from "./icons/cv-icon"
import Link from "next/link"

export default function Welcome() {
    return (
        <section className="text-3xl relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
            <article>
                <Avatar>
                    <AvatarImage src="https://media.licdn.com/dms/image/C4D03AQHWIJ6gsFJ5Nw/profile-displayphoto-shrink_800_800/0/1542917630676?e=1704326400&v=beta&t=NFkSNcdMzzI-vGhCNa6JQhr0URSkwWZOP5mXE4Ky5hA" />
                    <AvatarFallback>YU</AvatarFallback>
                </Avatar>
                <section className="flex justify-between items-center">
                    <article>
                        <H2Typo>Yenson Umaña Solano - YenUS</H2Typo>
                    </article>
                    <aside className="flex items-center flex-wrap justify-end">
                        <Button size="icon" className="p-0 lg:p-1.5 group/icons hover:bg-transparent rounded-lg m-1" title="Linkedin" asChild><Link href="https://www.linkedin.com/in/yenson-umaña-solano-a47949175/" target="_blank" rel="noopener"><LinkedinSVG/> </Link></Button>
                        <Button size="icon" className="p-0 lg:p-1.5 group/icons hover:bg-transparent rounded-lg m-1" title="GitHub" asChild><Link href="https://github.com/Yen-US" target="_blank" rel="noopener"><GitSVG/></Link></Button>
                        <Button size="icon" className="p-0 lg:p-1.5 group/icons hover:bg-transparent rounded-lg m-1" title="Download CV/Resume"asChild><Link href="./api"><CVSVG/></Link></Button>
                    </aside>
                </section>
                <H1Typo>Junior Full Stack Software Engineer</H1Typo>
            </article>
        </section>
    )
}
