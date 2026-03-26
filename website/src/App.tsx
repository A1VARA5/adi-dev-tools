import Nav from './components/Nav'
import Hero from './components/Hero'
import Packages from './components/Packages'
import Examples from './components/Examples'
import ChainFacts from './components/ChainFacts'
import GetStarted from './components/GetStarted'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-slate-200">
      <Nav />
      <main>
        <Hero />
        <GetStarted />
        <Packages />
        <Examples />
        <ChainFacts />
      </main>
      <Footer />
    </div>
  )
}
