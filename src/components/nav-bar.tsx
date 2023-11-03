import { ModeToggle } from '@/components/mode-toggle'
import H4Typo from './typography/h4-typo'
import Image from 'next/image'

export default function NavBar() {
    return (
        <header className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            <aside className="fixed bottom-0 left-0 flex h-50 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none lg:rounded-full lg:border lg:bg-gray-200 lg:p-0 lg:dark:bg-zinc-800/30">
                <Image src='/logo.png' width={100} height={100} alt="YenUS logo" title='YenUS logo'></Image>
            </aside>
            <aside className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-3 pt-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-2 lg:dark:bg-zinc-800/30">
                <ModeToggle></ModeToggle>
            </aside>
        </header>
    )
}
