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
        <section className="text-3xl relative flex place-items-center">
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
