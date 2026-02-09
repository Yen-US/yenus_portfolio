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
            Professional services business focused on AI automations and business
            processes.
          </STypo>
          <MutedTypo>2024 / 03 - Current</MutedTypo>
        </article>
        <aside className="flex items-center flex-wrap justify-end">
          <Badge className="hover:animate-pulse m-1" title="Automations">
            Automations
          </Badge>
          <Badge className="hover:animate-pulse m-1" title="Services">
            Services
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
          <Link href="https://chat.yenus.dev" target="blank">
            <img src="/chat.yenus.dev.webp" className="w-80 hidden dark:block" />
            <img src="/chat.yenus.dev.webp" className="w-80 dark:hidden" />
          </Link>
        </button>
        <article className="w-1/2">
          <LinkTypo href="https://chat.yenus.dev">
            YenUS Chat
          </LinkTypo>
          <H4Typo>AI Assistant</H4Typo>
          <STypo>
            Personal extension of the Vercel chatbot with RAG on my data, web
            search, and image generation for personal use.
          </STypo>
          <MutedTypo>Ongoing</MutedTypo>
        </article>
        <aside className="flex items-center flex-wrap justify-end">
          <Badge className="hover:animate-pulse m-1" title="RAG">
            RAG
          </Badge>
          <Badge className="hover:animate-pulse m-1" title="Web Search">
            Web Search
          </Badge>
          <Badge className="hover:animate-pulse m-1" title="Image Gen">
            Image Gen
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
          <Link href="https://ikido.app" target="blank">
            <img src="/ikido.app.webp" className="w-80 hidden dark:block" />
            <img src="/ikido.app.webp" className="w-80 dark:hidden" />
          </Link>
        </button>
        <article className="w-1/2">
          <LinkTypo href="https://ikido.app">
            Ikido
          </LinkTypo>
          <H4Typo>Product Platform</H4Typo>
          <STypo>
            Goal-driven Human OS planning software for building and tracking
            life systems.
          </STypo>
          <MutedTypo>Ongoing</MutedTypo>
        </article>
        <aside className="flex items-center flex-wrap justify-end">
          <Badge className="hover:animate-pulse m-1" title="Human OS">
            Human OS
          </Badge>
          <Badge className="hover:animate-pulse m-1" title="Planning">
            Planning
          </Badge>
          <Badge className="hover:animate-pulse m-1" title="Goals">
            Goals
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
          <Link href="https://memorias.studio" target="blank">
            <img src="/memorias.studio.webp" className="w-80 hidden dark:block" />
            <img src="/memorias.studio.webp" className="w-80 dark:hidden" />
          </Link>
        </button>
        <article className="w-1/2">
          <LinkTypo href="https://memorias.studio">
            Memoria Studio
          </LinkTypo>
          <H4Typo>E-commerce Business</H4Typo>
          <STypo>
            Successful AI-generated 3D-printed figurine business created by me.
          </STypo>
          <MutedTypo>Ongoing</MutedTypo>
        </article>
        <aside className="flex items-center flex-wrap justify-end">
          <Badge className="hover:animate-pulse m-1" title="3D Printing">
            3D Printing
          </Badge>
          <Badge className="hover:animate-pulse m-1" title="AI">
            AI
          </Badge>
          <Badge className="hover:animate-pulse m-1" title="E-commerce">
            E-commerce
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
