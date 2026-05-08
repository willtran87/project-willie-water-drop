import { Link } from 'react-router'
import { PageLayout } from '../components/layout/PageLayout'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#dfeaf4]">
      <img
        src={asset('assets/environment/cloud.png')}
        alt=""
        className="pixel-art absolute left-[18%] top-24 w-[92px] opacity-80"
      />
      <img
        src={asset('assets/environment/cloud.png')}
        alt=""
        className="pixel-art absolute right-[16%] top-20 w-[118px] opacity-85"
      />
      <img
        src={asset('assets/environment/water-tower-2.png')}
        alt=""
        className="pixel-art absolute bottom-0 right-[-54px] z-10 w-[260px] opacity-80 sm:right-[2%] sm:w-[300px] sm:opacity-85 lg:w-[340px]"
      />
      <img
        src={asset('assets/sprites/willie-cool.png')}
        alt=""
        className="pixel-art absolute bottom-0 right-[35%] z-50 hidden w-[72px] sm:block lg:w-[82px]"
      />
      <img
        src={asset('assets/sprites/willie-cool.png')}
        alt=""
        className="pixel-art absolute bottom-0 right-[39%] z-50 w-[58px] sm:hidden"
      />
      <img
        src={asset('assets/environment/ground.png')}
        alt=""
        className="pixel-art absolute inset-x-0 bottom-0 z-40 h-[26px] w-full object-cover"
      />
    </div>
  )
}

export function HomePage() {
  return (
    <PageLayout>
      <section className="relative min-h-[760px] overflow-hidden border-b-4 border-slate-950 sm:min-h-[540px]">
        <HeroScene />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/88 to-slate-950/10" />
        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-6xl items-start px-6 pt-12 sm:min-h-[540px] sm:items-center sm:pt-0 lg:px-8">
          <div className="max-w-xl py-8 sm:py-12">
            <div className="mb-3 text-sm uppercase tracking-[0.2em] text-sky-300/80">
              Water Awareness Game
            </div>
            <h1 className="mb-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
              Meet Willie
              <br />
              the Water Drop
            </h1>
            <p className="mb-8 max-w-md text-lg leading-relaxed text-white/75">
              Run, jump, dodge hydrants, and answer water conservation trivia
              across 30 pixel-packed levels.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/levels"
                className="pixel-button rounded-lg bg-sky-400 px-9 py-4 text-lg font-bold text-slate-950 transition-colors hover:bg-sky-300"
              >
                PLAY NOW
              </Link>
              <a
                href="#about"
                className="rounded-lg border-2 border-white/30 px-9 py-4 text-lg font-semibold text-white transition-colors hover:border-sky-300 hover:text-sky-200"
              >
                LEARN MORE
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950/70 border-y border-white/10">
        <div className="mx-auto flex max-w-3xl justify-center gap-12 px-6 py-6 sm:gap-20">
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
      </section>

      <section id="about" className="mx-auto grid max-w-5xl gap-6 px-6 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <h2 className="mb-4 text-3xl font-bold">How to Play</h2>
          <div className="space-y-4 text-white/70">
            <p>
              Willie is a water drop on a mission. Help him jump past hydrants,
              water meters, utility vehicles, and other public-works surprises.
            </p>
            <p>
              Reach the score target and Willie checks in with a water trivia
              question. Answer correctly to unlock the next level.
            </p>
            <p>
              <strong className="text-white">Controls:</strong>{' '}
              <kbd className="rounded bg-white/10 px-2 py-1 text-sm">SPACE</kbd>{' '}
              or tap/click to jump.
            </p>
          </div>
        </div>

        <div className="pixel-panel rounded-lg p-5">
          <div className="relative min-h-[210px] overflow-hidden rounded-md bg-[#e8edf0]">
            <img
              src={asset('assets/environment/water-tower-1.png')}
              alt=""
              className="pixel-art absolute bottom-2 right-8 z-10 w-[140px] opacity-90"
            />
            <img
              src={asset('assets/environment/water-fountain.png')}
              alt=""
              className="pixel-art absolute bottom-2 right-52 z-20 w-[58px] opacity-90"
            />
            <img
              src={asset('assets/environment/signpost.png')}
              alt=""
              className="pixel-art absolute bottom-0 right-36 z-30 w-[38px]"
            />
            <img
              src={asset('assets/sprites/willie-professor.png')}
              alt=""
              className="pixel-art absolute bottom-2 left-8 z-30 w-[64px]"
            />
            <div
              aria-hidden="true"
              className="pixel-art absolute bottom-0 left-28 z-30 h-[58px] w-[58px] bg-no-repeat"
              style={{
                backgroundImage: `url(${asset('assets/sprites/water-meter.png')})`,
                backgroundPosition: '0 0',
                backgroundSize: '400% 100%',
              }}
            />
            <img
              src={asset('assets/environment/ground.png')}
              alt=""
              className="pixel-art absolute inset-x-0 bottom-0 z-20 h-[26px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 lg:grid-cols-2 lg:px-8">
        <div className="pixel-card rounded-lg border-2 border-sky-400/20 p-6">
          <h2 className="mb-3 text-2xl font-bold text-sky-400">Drinking Water Week</h2>
          <p className="mb-4 leading-relaxed text-white/70">
            Willie Water Drop celebrates the systems, people, and habits that
            keep safe drinking water flowing. The trivia questions cover water
            conservation, treatment, and the journey from source to tap.
          </p>
          <a
            href="https://www.awwa.org/communications-and-outreach/drinking-water-week/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg border border-sky-400/30 bg-sky-400/15 px-5 py-2.5 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-400/25"
          >
            Learn more at AWWA.org
          </a>
        </div>

        <div className="pixel-card rounded-lg border-2 border-emerald-400/20 p-6">
          <h2 className="mb-3 text-2xl font-bold text-emerald-400">Bloomington Public Works</h2>
          <p className="mb-4 leading-relaxed text-white/70">
            The City of Bloomington, Minnesota Public Works Department keeps
            essential water, sewer, storm water, streets, and fleet services
            running for the community.
          </p>
          <a
            href="https://www.bloomingtonmn.gov/eng/public-works-department"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg border border-emerald-400/30 bg-emerald-400/15 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-400/25"
          >
            Visit Bloomington Public Works
          </a>
        </div>
      </section>
    </PageLayout>
  )
}
