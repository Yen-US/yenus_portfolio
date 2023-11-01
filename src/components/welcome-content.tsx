import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import H1Typo from "./typography/h1-typo"
import H2Typo from "./typography/h2-typo"

export default function Welcome() {
    return (
        <section className="text-3xl relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
            <article>
            <Avatar>
                <AvatarImage src="https://media.licdn.com/dms/image/C4D03AQHWIJ6gsFJ5Nw/profile-displayphoto-shrink_800_800/0/1542917630676?e=1704326400&v=beta&t=NFkSNcdMzzI-vGhCNa6JQhr0URSkwWZOP5mXE4Ky5hA" />
                <AvatarFallback>YU</AvatarFallback>
            </Avatar>

            <H2Typo>Yenson Umaña Solano - YenUS</H2Typo>
            <H1Typo>Junior Full Stack Software Engineer</H1Typo>
            </article>
        </section>
    )
}
