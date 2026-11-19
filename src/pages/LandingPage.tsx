import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight, ArrowRight, AudioLines, BarChart3, Check, ChevronDown,
  CirclePlay, FileUp, Gauge, LockKeyhole, Menu, Mic2, ShieldCheck,
  Sparkles, Target, Users, X, Zap,
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { LogoLink } from "../components/Logo";
import { getPlans } from "../lib/plans";
import { usePublicPrice } from "../hooks/usePublicPrice";
import { getAuthToken } from "../lib/authStorage";

const questions = [
  ["What exactly is VentureRoom?", "A private practice environment where founders rehearse investor conversations with an AI panel that reads their deck, asks adaptive questions and produces a measurable readiness report."],
  ["Do I need a finished pitch deck?", "No. You can start with the information you have and add a deck when it is ready. Uploading a deck gives the panel more context for its questions."],
  ["Is this a real investor or funding guarantee?", "No. VentureRoom is a preparation tool, not an investment firm, broker or guarantee of funding. The panel simulates challenging investor perspectives so you can prepare."],
  ["Are my pitch materials public?", "No. Your decks, recordings, transcripts and reports remain private unless you deliberately create and share a report link."],
  ["Can I use it for grants and accelerators?", "Yes. Choose the kind of room you are preparing for and use the rehearsal to practise explaining your business, evidence, traction and plans."],
];

const stages = [
  { n: "01", title: "Bring the raw idea", body: "Add your business context and upload the deck you plan to present. The panel uses your material as its source of truth.", icon: FileUp },
  { n: "02", title: "Enter the room", body: "Choose the investor mix and challenge level. Answer aloud or type while the panel follows up on what you say.", icon: AudioLines },
  { n: "03", title: "Leave with your next move", body: "Review your scorecard, spot the weak answers and get a focused list of what to improve before the next attempt.", icon: BarChart3 },
];

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const publicPrice = usePublicPrice();
  const plans = useMemo(() => getPlans(publicPrice), [publicPrice]);
  useEffect(() => { setLoggedIn(Boolean(getAuthToken())); }, []);
  useEffect(() => { fetch("/api/health").catch(() => undefined); }, []);
  const start = loggedIn ? "/setup" : "/signup";

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4F2E9] text-[#14231D] dark:bg-[#101915] dark:text-[#F3F4EA]">
      <header className="relative z-30 border-b border-[#14231D]/10 dark:border-white/10">
        <nav className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <LogoLink showText size="md" />
          <div className="hidden items-center gap-8 lg:flex">
            <a className="text-sm text-[#526159] transition hover:text-[#14231D] dark:text-white/60 dark:hover:text-white" href="#method">The method</a>
            <a className="text-sm text-[#526159] transition hover:text-[#14231D] dark:text-white/60 dark:hover:text-white" href="#scorecard">What you get</a>
            <a className="text-sm text-[#526159] transition hover:text-[#14231D] dark:text-white/60 dark:hover:text-white" href="#plans">Plans</a>
            <a className="text-sm text-[#526159] transition hover:text-[#14231D] dark:text-white/60 dark:hover:text-white" href="#questions">Questions</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden items-center gap-3 sm:flex">
              <Link to={loggedIn ? "/dashboard" : "/login"} className="px-3 py-2 text-sm font-semibold">{loggedIn ? "Workspace" : "Sign in"}</Link>
              <Link to={start} className="rounded-full bg-[#C8E56A] px-5 py-3 text-sm font-bold text-[#14231D] transition hover:bg-[#D8F28A]">Enter VentureRoom <ArrowRight className="ml-2 inline" size={15} /></Link>
            </div>
            <button className="rounded-full border border-current/15 p-2 lg:hidden" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
          </div>
        </nav>
        {menuOpen && <div className="absolute left-0 right-0 top-full flex flex-col gap-4 border-b border-black/10 bg-[#F4F2E9] px-6 py-6 shadow-xl dark:bg-[#101915] lg:hidden"><a href="#method" onClick={() => setMenuOpen(false)}>The method</a><a href="#scorecard" onClick={() => setMenuOpen(false)}>What you get</a><a href="#plans" onClick={() => setMenuOpen(false)}>Plans</a><a href="#questions" onClick={() => setMenuOpen(false)}>Questions</a><Link to={start} className="rounded-full bg-[#C8E56A] px-5 py-3 text-center font-bold text-[#14231D]">Enter VentureRoom</Link></div>}
      </header>

      <section className="relative mx-auto grid max-w-[1440px] gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-12 lg:pb-28 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[.24em] text-[#55705F] dark:text-[#B4CB9C]"><span className="h-px w-9 bg-current" /> Founder preparation, reimagined</div>
          <h1 className="max-w-[760px] font-serif text-[clamp(3.8rem,7.6vw,7.6rem)] leading-[.91] tracking-[-.065em]">The room is high stakes.<br /><em className="font-normal text-[#64834B] dark:text-[#C8E56A]">The practice</em><br />doesn't have to be.</h1>
          <p className="mt-8 max-w-[540px] text-base leading-8 text-[#5B665F] dark:text-white/65 sm:text-lg">A private investor simulation for founders who want sharper answers, stronger numbers and more confidence before the conversation that could change everything.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to={start} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#173D2D] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#24563E] dark:bg-[#C8E56A] dark:text-[#14231D]">Run your first rehearsal <ArrowDownRight size={17} /></Link>
            <a href="#method" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#14231D]/20 px-7 py-4 text-sm font-bold transition hover:bg-white/50 dark:border-white/20 dark:hover:bg-white/5">See how it works</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#14231D]/15 pt-5 text-xs font-medium text-[#647168] dark:border-white/15 dark:text-white/55"><span className="inline-flex items-center gap-2"><ShieldCheck size={14} /> Private by default</span><span className="inline-flex items-center gap-2"><Zap size={14} /> Start with a free plan</span><span className="inline-flex items-center gap-2"><Target size={14} /> Built around your deck</span></div>
        </div>

        <div className="relative mx-auto w-full max-w-[650px]">
          <div className="absolute -right-10 -top-14 h-64 w-64 rounded-full bg-[#D9E8A4]/70 blur-3xl dark:bg-[#C8E56A]/10" />
          <div className="relative overflow-hidden rounded-[2rem] bg-[#183B2D] p-5 text-white shadow-[0_35px_90px_rgba(20,45,32,.22)] sm:p-8">
            <div className="flex items-center justify-between border-b border-white/15 pb-5"><div><p className="text-[9px] font-bold uppercase tracking-[.22em] text-[#C8E56A]">Live simulation · preview</p><p className="mt-1 text-lg font-semibold">Your investor room</p></div><span className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-[10px] text-white/75"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C8E56A]" /> Session active</span></div>
            <div className="grid grid-cols-3 gap-2 py-6">
              {[["01","The operator","Market + execution"],["02","The skeptic","Risk + defensibility"],["03","The strategist","Scale + return"]].map(([n,t,d]) => <div key={n} className="rounded-2xl border border-white/15 bg-white/[.06] p-3 sm:p-4"><span className="text-[10px] text-[#C8E56A]">{n} / PANEL</span><p className="mt-4 text-xs font-bold sm:text-sm">{t}</p><p className="mt-1 text-[10px] leading-4 text-white/50">{d}</p></div>)}
            </div>
            <div className="rounded-2xl bg-[#F2F0E6] p-4 text-[#1A2A21] sm:p-5">
              <div className="flex items-center justify-between"><span className="text-[9px] font-extrabold uppercase tracking-[.18em] text-[#6A796D]">Question 04 · Market proof</span><span className="text-[10px] font-semibold text-[#66804E]">Follow-up</span></div>
              <p className="mt-3 font-serif text-xl leading-snug sm:text-2xl">“You say the market is underserved. What evidence shows customers will pay to solve this?”</p>
              <div className="mt-5 flex items-center gap-3 border-t border-[#1A2A21]/10 pt-4"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDE8C8] text-[#31553B]"><Mic2 size={16} /></span><div className="flex-1"><div className="flex h-5 items-center gap-1">{Array.from({length:25},(_,i)=><span key={i} className="w-1 rounded-full bg-[#64834B]" style={{height:((i*17)%15)+4}} />)}</div><p className="mt-1 text-[9px] text-[#788278]">Your answer is being evaluated</p></div><span className="text-[10px] font-bold text-[#31553B]">00:38</span></div>
            </div>
            <div className="mt-5 flex items-center justify-between text-[10px] text-white/55"><span>Deck context loaded · 12 slides</span><span className="inline-flex items-center gap-1"><Sparkles size={12} className="text-[#C8E56A]" /> Adaptive questions</span></div>
          </div>
          <div className="relative -mt-3 ml-auto mr-5 w-[78%] rounded-2xl border border-[#173D2D]/10 bg-white p-4 text-[#14231D] shadow-xl dark:border-white/10 dark:bg-[#202D25] dark:text-white sm:p-5">
            <div className="flex items-center justify-between"><p className="text-[9px] font-extrabold uppercase tracking-[.18em] text-[#6B786F] dark:text-white/45">Readiness snapshot</p><span className="rounded-full bg-[#E8F0D7] px-2 py-1 text-[9px] font-bold text-[#496A38] dark:bg-[#C8E56A]/15 dark:text-[#C8E56A]">Illustrative</span></div>
            <div className="mt-3 flex items-end justify-between"><p className="font-serif text-4xl">78<span className="text-base text-[#7D897F]">/100</span></p><p className="text-[10px] font-bold text-[#64834B]">+12 from last round</p></div>
            <div className="mt-3 grid grid-cols-4 gap-1"><span className="h-1.5 rounded-full bg-[#8AA56C]" /><span className="h-1.5 rounded-full bg-[#8AA56C]" /><span className="h-1.5 rounded-full bg-[#8AA56C]" /><span className="h-1.5 rounded-full bg-[#E5E9DE]" /></div>
            <p className="mt-3 text-[10px] text-[#738076] dark:text-white/45">Clarity · Evidence · Delivery · Readiness</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#14231D]/10 bg-[#E9EBDD] py-7 dark:border-white/10 dark:bg-white/[.03]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-12 gap-y-4 px-5 text-center sm:px-8 lg:justify-between lg:px-12"><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#718071] dark:text-white/40">Prepare for the moment</p>{["Angel conversations","Accelerator interviews","Grant panels","Demo days","Seed rounds"].map(x=><span key={x} className="font-serif text-lg text-[#405348] dark:text-white/70">{x}</span>)}</div>
      </section>

      <section id="method" className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div className="max-w-md"><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#64834B] dark:text-[#C8E56A]">A deliberate process</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] tracking-[-.045em] sm:text-6xl">Turn uncertainty into a <em className="text-[#64834B] dark:text-[#C8E56A]">rehearsal plan.</em></h2><p className="mt-6 text-sm leading-7 text-[#647168] dark:text-white/55">The goal isn't to memorise a perfect script. It's to understand your business deeply enough to handle the questions you didn't expect.</p></div>
          <div className="border-t border-[#14231D]/15 dark:border-white/15">{stages.map(({n,title,body,icon:Icon})=><article key={n} className="grid gap-4 border-b border-[#14231D]/15 py-7 dark:border-white/15 sm:grid-cols-[70px_1fr_48px] sm:items-start"><span className="font-serif text-2xl text-[#8A9A87]">{n}</span><div><h3 className="font-serif text-2xl">{title}</h3><p className="mt-2 max-w-xl text-sm leading-7 text-[#647168] dark:text-white/55">{body}</p></div><span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#14231D]/15 text-[#64834B] dark:border-white/15 dark:text-[#C8E56A]"><Icon size={19}/></span></article>)}</div>
        </div>
      </section>

      <section id="scorecard" className="bg-[#173D2D] py-24 text-white lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-12">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#C8E56A]">The useful part starts after</p><h2 className="mt-5 max-w-lg font-serif text-5xl leading-[1.02] tracking-[-.04em] sm:text-6xl">A score is a signal.<br/><em className="font-normal text-[#C8E56A]">A plan is progress.</em></h2><p className="mt-6 max-w-lg text-sm leading-7 text-white/65">Your session becomes a structured review of what landed, what raised doubts and what to work on next. Repeat the exercise and track whether the changes are making a difference.</p><Link to={start} className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#C8E56A] px-6 py-3.5 text-sm font-bold text-[#14231D]">See your readiness report <ArrowRight size={16}/></Link></div>
          <div className="rounded-[1.75rem] border border-white/15 bg-[#214A38] p-5 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/15 pb-5"><div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-white/45">Founder readiness review</p><p className="mt-1 text-lg font-semibold">Session debrief</p></div><span className="rounded-full bg-[#C8E56A]/15 px-3 py-1.5 text-[9px] font-bold text-[#D7F18B]">Example report</span></div>
            <div className="grid gap-6 py-7 sm:grid-cols-[150px_1fr] sm:items-center"><div className="flex flex-col items-center justify-center rounded-2xl bg-[#173D2D] py-5"><Gauge size={22} className="text-[#C8E56A]"/><p className="mt-2 font-serif text-5xl">78</p><p className="mt-1 text-[9px] uppercase tracking-widest text-white/45">Readiness score</p></div><div className="space-y-4">{[["Business clarity",84],["Market evidence",62],["Delivery",88],["Investor readiness",76]].map(([label,value])=><div key={label}><div className="mb-1.5 flex justify-between text-xs"><span className="text-white/75">{label}</span><span className="font-bold text-[#D7F18B]">{value}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#C8E56A]" style={{width:value+"%"}}/></div></div>)}</div></div>
            <div className="grid gap-3 border-t border-white/15 pt-5 sm:grid-cols-2"><div className="rounded-xl bg-white/[.06] p-4"><p className="text-[9px] font-bold uppercase tracking-widest text-[#C8E56A]">Strongest signal</p><p className="mt-2 text-sm font-semibold">Clear problem and customer focus</p></div><div className="rounded-xl bg-white/[.06] p-4"><p className="text-[9px] font-bold uppercase tracking-widest text-[#E5B77D]">Needs attention</p><p className="mt-2 text-sm font-semibold">Evidence behind market size</p></div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12">
        <div className="grid gap-8 border-b border-[#14231D]/15 pb-12 dark:border-white/15 md:grid-cols-3">{[{icon:Users,title:"Different investor lenses",body:"Pressure-test your business from more than one point of view."},{icon:LockKeyhole,title:"Your work stays yours",body:"Practice privately. Choose what you share and when."},{icon:BarChart3,title:"Progress you can see",body:"Compare sessions and focus on the gaps that matter most."}].map(({icon:Icon,title,body})=><div key={title}><Icon size={22} className="text-[#64834B] dark:text-[#C8E56A]"/><h3 className="mt-5 font-serif text-2xl">{title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-[#647168] dark:text-white/55">{body}</p></div>)}</div>
      </section>

      <section id="plans" className="bg-[#E9EBDD] py-24 dark:bg-white/[.03]">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12"><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#64834B] dark:text-[#C8E56A]">Choose your runway</p><h2 className="mt-4 font-serif text-5xl tracking-[-.04em] sm:text-6xl">Start where you are.</h2></div><p className="max-w-sm text-sm leading-7 text-[#647168] dark:text-white/55">Build the habit first. Upgrade when your preparation needs more room.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{plans.map((plan)=> <article key={plan.name} className={`flex h-full flex-col rounded-3xl border p-6 ${plan.featured ? "border-[#173D2D] bg-[#173D2D] text-white" : "border-[#14231D]/10 bg-[#F7F6F0] text-[#14231D] dark:border-white/10 dark:bg-[#1B2820] dark:text-white"}`}><div className="flex items-center justify-between"><h3 className="font-serif text-2xl">{plan.name}</h3>{plan.featured && <span className="rounded-full bg-[#C8E56A] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#14231D]">Popular</span>}</div><p className={`mt-5 font-serif text-3xl ${plan.featured ? "text-[#C8E56A]" : ""}`}>{plan.price || (plan.id === "enterprise" ? "Custom" : "—")}</p><p className={`mt-2 min-h-10 text-xs leading-5 ${plan.featured ? "text-white/60" : "text-[#6D786F] dark:text-white/50"}`}>{plan.tagline}</p><ul className={`my-7 flex-1 space-y-3 text-xs leading-5 ${plan.featured ? "text-white/75" : "text-[#526159] dark:text-white/65"}`}>{plan.features.slice(0,4).map(line=><li key={line} className="flex gap-2"><Check size={14} className={`mt-0.5 shrink-0 ${plan.featured ? "text-[#C8E56A]" : "text-[#64834B]"}`}/>{line}</li>)}</ul>{plan.available ? <Link to={plan.cta.href} className={`rounded-full px-4 py-3 text-center text-xs font-bold ${plan.featured ? "bg-[#C8E56A] text-[#14231D]" : "border border-[#14231D]/20 dark:border-white/20"}`}>{plan.cta.label}</Link> : <span className="rounded-full border border-current/15 px-4 py-3 text-center text-xs font-bold opacity-45">{plan.cta.label}</span>}</article>)}</div>
          <div className="mt-7 text-center"><Link to="/pricing" className="inline-flex items-center gap-2 text-sm font-bold underline decoration-[#8CA27B] underline-offset-4">Compare every feature <ArrowRight size={15}/></Link></div>
        </div>
      </section>

      <section id="questions" className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:px-12"><div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#64834B] dark:text-[#C8E56A]">Before you step in</p><h2 className="mt-4 font-serif text-5xl tracking-[-.04em]">A few good questions.</h2><p className="mt-5 max-w-xs text-sm leading-7 text-[#647168] dark:text-white/55">Still deciding if this is the right preparation tool? Start here.</p></div><div className="border-t border-[#14231D]/15 dark:border-white/15">{questions.map(([q,a])=><details key={q} className="group border-b border-[#14231D]/15 py-5 dark:border-white/15"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl">{q}<ChevronDown size={18} className="shrink-0 transition group-open:rotate-180"/></summary><p className="max-w-2xl pt-4 text-sm leading-7 text-[#647168] dark:text-white/55">{a}</p></details>)}</div></section>

      <footer className="bg-[#142D22] py-12 text-white"><div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-12"><div><LogoLink showText size="md"/><p className="mt-4 max-w-sm text-xs leading-6 text-white/50">Make your next big room feel familiar. Prepare with intention. Pitch with clarity.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/60"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/support">Support</Link><Link to="/discover">Discover</Link></div><p className="text-[10px] text-white/40">Built by Heartcode Technologies · © {new Date().getFullYear()} VentureRoom</p></div></footer>
    </main>
  );
}
