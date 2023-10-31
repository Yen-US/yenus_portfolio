import NavBar from '@/components/nav-bar'
import Welcome from '@/components/welcome-content'
import Footer from '@/components/footer'
import Education from '@/components/education-content'
import Experience from '@/components/experience-content'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-14 space-y-6">
      <NavBar></NavBar>
      <Welcome></Welcome>
      <Experience></Experience>
      <Education></Education>
      <Footer></Footer>
    </main>
  )
}
