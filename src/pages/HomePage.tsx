import { Link } from 'react-router'
import { PageLayout } from '../components/layout/PageLayout'

export function HomePage() {
  return (
    <PageLayout>
      <div className="text-center px-8 py-24"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)' }}
      >
        <div className="text-sm uppercase tracking-[0.2em] text-white/50 mb-3">
          Water Awareness Game
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Meet Willie<br />the Water Drop
        </h1>
        <p className="text-lg text-white/70 max-w-md mx-auto mb-10">
          Run, jump, and learn about water conservation across 30 levels of trivia-powered fun.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/levels"
            className="bg-sky-400 text-slate-900 px-9 py-4 rounded-lg font-bold text-lg hover:bg-sky-300 transition-colors"
          >
            PLAY NOW
          </Link>
          <a
            href="#about"
            className="border-2 border-white/30 px-9 py-4 rounded-lg font-semibold text-lg hover:border-white/60 transition-colors"
          >
            LEARN MORE
          </a>
        </div>
      </div>

      <div className="flex justify-center gap-16 py-6 bg-black/20">
        <div className="text-center">
          <div className="text-3xl font-bold">30</div>
          <div className="text-xs uppercase text-white/50">Levels</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">5</div>
          <div className="text-xs uppercase text-white/50">Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">25</div>
          <div className="text-xs uppercase text-white/50">Trivia Q's</div>
        </div>
      </div>

      <div id="about" className="max-w-2xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-6">How to Play</h2>
        <div className="space-y-4 text-white/70">
          <p>
            Willie is a water drop on a mission! Help him run through each level
            by jumping over obstacles — fire hydrants, vehicles, and more.
          </p>
          <p>
            Reach the score target and you'll face a trivia question about water
            conservation. Answer correctly to unlock the next level!
          </p>
          <p>
            <strong className="text-white">Controls:</strong> Press <kbd className="bg-white/10 px-2 py-1 rounded text-sm">SPACE</kbd> or
            tap/click to jump.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 pb-16">
        <div className="rounded-xl border border-sky-400/20 bg-sky-400/5 p-6">
          <h2 className="text-2xl font-bold mb-3 text-sky-400">Drinking Water Week</h2>
          <p className="text-white/70 mb-3 leading-relaxed">
            Willie Water Drop was created to celebrate <strong className="text-white">Drinking Water Week</strong>, an
            annual event organized by the American Water Works Association (AWWA). Every year,
            water utilities across the country use this week to highlight the importance of safe,
            reliable drinking water and the infrastructure that delivers it to our communities.
          </p>
          <p className="text-white/70 mb-4 leading-relaxed">
            The trivia questions in this game are all about water conservation, treatment, and
            the journey water takes from source to tap. While you're dodging hydrants and water
            meters, you're also learning what it takes to keep clean water flowing!
          </p>
          <a
            href="https://www.awwa.org/communications-and-outreach/drinking-water-week/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-sky-400/15 border border-sky-400/30 text-sky-400 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-sky-400/25 transition-colors"
          >
            Learn more at AWWA.org
            <span className="text-xs opacity-60">&#x2197;</span>
          </a>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-8 pb-16">
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-6">
          <h2 className="text-2xl font-bold mb-3 text-emerald-400">City of Bloomington Public Works</h2>
          <p className="text-white/70 mb-3 leading-relaxed">
            Willie Water Drop was built by the <strong className="text-white">City of Bloomington, Minnesota
            Public Works Department</strong>. Bloomington Public Works manages the city's drinking
            water system, sanitary sewer, storm water, streets, and fleet services — keeping essential
            infrastructure running for over 90,000 residents.
          </p>
          <p className="text-white/70 mb-4 leading-relaxed">
            This game was originally launched during Water Week as a fun way for city employees and
            residents to learn about where their water comes from, how it's treated, and why
            conservation matters. Every trivia question in the game comes straight from Bloomington's
            water utility team.
          </p>
          <a
            href="https://www.bloomingtonmn.gov/eng/public-works-department"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-400/25 transition-colors"
          >
            Visit Bloomington Public Works
            <span className="text-xs opacity-60">&#x2197;</span>
          </a>
        </div>
      </div>
    </PageLayout>
  )
}
