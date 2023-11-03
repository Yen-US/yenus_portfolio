import NavBar from '@/components/nav-bar'
import Welcome from '@/components/welcome-content'
import Education from '@/components/education-content'
import Experience from '@/components/experience-content'
import Skills from '@/components/skills-content'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-14 space-y-32">
      <NavBar></NavBar>
      <Welcome></Welcome>
      <Experience></Experience>
      <Skills></Skills>
      <Education></Education>
    </main>
  )
}
