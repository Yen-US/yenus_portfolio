import H2Typo from "./typography/h2-typo";
import H4Typo from "./typography/h4-typo";
import STypo from "./typography/small-typo";
import MutedTypo from "./typography/muted-typo";
import { Badge } from "@/components/ui/badge";
import ReactSVG from "./icons/react-icon";
import NextSVG from "./icons/nextjs-icon";
import TSSVG from "./icons/ts-icon";
import LinkTypo from "./typography/link-typo";
import Link from "next/link";

export default function Projects() {
  return (
    <section className="text-xl flex flex-col lg:w-1/2 space-y-6 mb-2">
      <H2Typo>Side Projects</H2Typo>
      <section className="px-2 lg:px-10 flex justify-between items-center">
        <button className="mr-6 hover:animate-zoom-in shadow-image-shadow hidden md:block">
          <Link href="https://losticoscustoms.tech/" target="blank">
            <img src="/LTC.webp" className="w-80 hidden dark:block" />
            <img src="/LTC.webp" className="w-80 dark:hidden" />
          </Link>
        </button>
        <article className="w-1/2">
          <LinkTypo href="https://losticoscustoms.tech/">
            Los Ticos Customs Store
          </LinkTypo>
          <H4Typo>Full Stack Project</H4Typo>
          <STypo>
            CEO and Founder of a Costa Rican custom tech store.
          </STypo>
          <MutedTypo>2024 / 04 - Current</MutedTypo>
        </article>
        <aside className="flex items-center flex-wrap justify-end">
        <Badge className="hover:animate-pulse m-1" title="Simple chat">
            Marketplace
          </Badge>
          <Badge className="hover:animate-pulse m-1" title="Simple chat">
            v1.0
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="React"
          >
            <ReactSVG />
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="Nextjs"
          >
            <NextSVG />
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="TypeScript"
          >
            <TSSVG />
          </Badge>
        </aside>
      </section>
      <section className="px-2 lg:px-10 flex justify-between items-center">
        <button className="mr-6 hover:animate-zoom-in shadow-image-shadow hidden md:block">
          <Link href="https://ecoticocrafts.com/" target="blank">
            <img src="/ecoticolanding.webp" className="w-80 hidden dark:block" />
            <img src="/ecoticolanding.webp" className="w-80 dark:hidden" />
          </Link>
        </button>
        <article className="w-1/2">
          <LinkTypo href="https://ecoticocrafts.com/">
            Eco Tico Crafts Store
          </LinkTypo>
          <H4Typo>Full Stack Project</H4Typo>
          <STypo>
            CEO and Founder of a Costa Rican conservation project for local endagered species.
          </STypo>
          <MutedTypo>2024 / 04 - Current</MutedTypo>
        </article>
        <aside className="flex items-center flex-wrap justify-end">
        <Badge className="hover:animate-pulse m-1" title="Simple chat">
            Marketplace
          </Badge>
          <Badge className="hover:animate-pulse m-1" title="Simple chat">
            v1.0
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="React"
          >
            <ReactSVG />
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="Nextjs"
          >
            <NextSVG />
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="TypeScript"
          >
            <TSSVG />
          </Badge>
        </aside>
      </section>
      <section className="px-2 lg:px-10 flex justify-between items-center">
        <button className="mr-6 hover:animate-zoom-in shadow-image-shadow hidden md:block">
          <Link href="https://yus-automation.vercel.app/" target="blank">
            <img src="/yus.webp" className="w-80 hidden dark:block" />
            <img src="/yus-light.webp" className="w-80 dark:hidden" />
          </Link>
        </button>
        <article className="w-1/2">
          <LinkTypo href="https://yus-automation.vercel.app/">
            YUS Automation
          </LinkTypo>
          <H4Typo>Full Stack Project</H4Typo>
          <STypo>
            CEO and Founder of a professional services bussiness focused on AI
            automations processes and business.
          </STypo>
          <MutedTypo>2024 / 03 - Current</MutedTypo>
        </article>
        <aside className="flex items-center flex-wrap justify-end">
          <Badge className="hover:animate-pulse m-1" title="Automations">
            Automations
          </Badge>
          <Badge className="hover:animate-pulse m-1" title="Simple chat">
            v1.0
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="React"
          >
            <ReactSVG />
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="Nextjs"
          >
            <NextSVG />
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="TypeScript"
          >
            <TSSVG />
          </Badge>
        </aside>
      </section>
      <section className="px-2 lg:px-10 flex justify-between items-center">
        <button className="mr-6 hover:animate-zoom-in shadow-image-shadow hidden md:block">
          <Link href="https://notery-ai-simple-chat.vercel.app" target="blank">
            <img src="/notery.webp" className="w-80 hidden dark:block" />
            <img src="/notery-light.webp" className="w-80 dark:hidden" />
          </Link>
        </button>
        <article className="w-1/2">
          <LinkTypo href="https://notery-ai-simple-chat.vercel.app">
            Notery.ai Simple chat
          </LinkTypo>
          <H4Typo>Full Stack Project</H4Typo>
          <STypo>
            Personal chat GPT like tool, focused on improving notes, Open source
            and completely free.
          </STypo>
          <MutedTypo>2024 / 01 - Current</MutedTypo>
        </article>
        <aside className="flex items-center flex-wrap justify-end">
          <Badge className="hover:animate-pulse m-1" title="Simple chat">
            Simple chat
          </Badge>
          <Badge className="hover:animate-pulse m-1" title="Simple chat">
            v1.0
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="React"
          >
            <ReactSVG />
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="Nextjs"
          >
            <NextSVG />
          </Badge>
          <Badge
            className="p-0.5 group/icons hover:bg-transparent hover:animate-pulse m-1"
            title="TypeScript"
          >
            <TSSVG />
          </Badge>
        </aside>
      </section>
    </section>
  );
}