import { Separator } from "@/components/ui/separator"

export default function Education() {
    return (
        <section className="text-xl flex flex-col w-2/3 space-y-6">
            <h2 className="text-2xl">Education</h2>
            <article>
                <h3>Computer Engineer</h3>
                <h4>Technological Institute of Costa Rica (TEC)</h4>
                <h4 className="text-lg">Cartago, Costa Rica</h4>
                <h4 className="text-lg">2018 - In progress</h4>
            </article>
            <Separator></Separator>
            <article>
                <h3>Python I</h3>
                <h4>SITEL Technical Academy</h4>
                <h4 className="text-lg">Heredia, Costa Rica</h4>
                <h4 className="text-lg">2021 - 2021</h4>
            </article>
            <Separator></Separator>
            <article>
                <h3>CISCO IT Essentials</h3>
                <h4>SITEL Technical Academy</h4>
                <h4 className="text-lg">Heredia, Costa Rica</h4>
                <h4 className="text-lg">2021 - 2021</h4>
            </article>
            <Separator></Separator>
            <article>
                <h3>Introduction To Programming</h3>
                <h4>SITEL Technical Academy</h4>
                <h4 className="text-lg">Heredia, Costa Rica</h4>
                <h4 className="text-lg">2021 - 2021</h4>
            </article>
        </section>
    )
}
