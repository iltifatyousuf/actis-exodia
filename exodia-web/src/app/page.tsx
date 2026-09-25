"use client"
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ─── Scroll Animation Hook ───
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// ─── Reusable Animated Section Wrapper ───
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Navbar Dropdown ───
function NavDropdown({ label, items }: { label: string, items: { title: string, desc: string, href: string }[] }) {
  const [open, setOpen] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const enter = () => { if (timeout.current) clearTimeout(timeout.current); setOpen(true) }
  const leave = () => { timeout.current = setTimeout(() => setOpen(false), 200) }

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button className="flex items-center gap-1 hover:opacity-60 transition-opacity font-semibold text-sm tracking-wide">
        {label}
        <svg className={`w-3 h-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[320px]"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="bg-[#E6E8DB] border-[1.5px] border-[#111] rounded-2xl p-3 shadow-[4px_4px_0px_#111]">
          {items.map((item, i) => (
            <Link key={i} href={item.href} className="block p-3 rounded-xl hover:bg-[#111] hover:text-[#E6E8DB] transition-all group">
              <div className="font-bold text-sm">{item.title}</div>
              <div className="text-xs opacity-60 group-hover:opacity-80 mt-0.5">{item.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Animated Counter ───
function Counter({ end, suffix = '' }: { end: number, suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, isVisible } = useScrollReveal()

  useEffect(() => {
    if (!isVisible) return
    let start = 0
    const duration = 2000
    const step = (timestamp: number) => {
      start = start || timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isVisible, end])

  return <span ref={ref}>{count}{suffix}</span>
}

// ─── Dot Grid Background ───
function DotGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{
      backgroundImage: 'radial-gradient(circle, #11111112 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }} />
  )
}

// ═══════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════
export default function ExodiaLandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const [navSolid, setNavSolid] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setNavSolid(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#E6E8DB] text-[#111111] relative selection:bg-[#111] selection:text-[#E6E8DB]" style={{ fontFamily: "'Space Grotesk', monospace" }}>
      <DotGrid />

      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed w-full top-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-500 ${navSolid ? 'bg-[#E6E8DB]/95 backdrop-blur-xl border-b-[1.5px] border-[#111] shadow-sm' : 'bg-transparent'}`}>
        <div className="text-2xl font-bold tracking-tight uppercase relative z-10">EXODIA.</div>
        <div className="hidden md:flex gap-8 items-center relative z-10">
          <NavDropdown label="Product" items={[
            { title: 'How It Works', desc: 'From packet to remediation in 340ms', href: '#how-it-works' },
            { title: 'Architecture', desc: '25 integrated tools, one brain', href: '#architecture' },
            { title: 'Advantages', desc: 'What makes Exodia different', href: '#advantages' },
          ]} />
          <NavDropdown label="Solutions" items={[
            { title: 'Financial Services', desc: 'PCI-DSS compliant autonomous SOC', href: '#use-cases' },
            { title: 'Defense & Government', desc: 'Airgapped, CMMC-ready deployment', href: '#use-cases' },
            { title: 'Healthcare', desc: 'HIPAA-compliant IoT protection', href: '#use-cases' },
          ]} />
          <Link href="#pricing" className="hover:opacity-60 transition-opacity font-semibold text-sm tracking-wide">Pricing</Link>
          <Link href="#" className="hover:opacity-60 transition-opacity font-semibold text-sm tracking-wide">Docs</Link>
        </div>
        <Link href="#demo" className="hidden md:block bg-[#111111] text-[#E6E8DB] px-6 py-2.5 rounded-full font-bold uppercase text-xs hover:bg-[#333] transition-colors tracking-wider relative z-10 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          Request Demo
        </Link>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="pt-32 md:pt-44 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        <Reveal className="flex-1">
          <div className="inline-flex items-center gap-2 border-[1.5px] border-[#111] rounded-full px-4 py-1.5 text-xs font-bold mb-8 tracking-wider">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            V2.0 — MULTI-AGENT ARCHITECTURE
          </div>
          <h1 className="text-4xl md:text-[4.5rem] font-bold tracking-tighter leading-[0.92] mb-6">
            Your SOC Team.<br />
            <span className="relative">
              Replaced by AI Agents.
              <svg className="absolute -bottom-2 left-0 w-full h-3 opacity-20" viewBox="0 0 400 12"><path d="M0 8 Q100 0 200 8 T400 8" stroke="#111" strokeWidth="3" fill="none" /></svg>
            </span>
          </h1>
          <p className="text-base md:text-lg font-medium opacity-60 mb-10 max-w-lg leading-relaxed">
            Exodia fuses eBPF kernel sensors, real-time Kafka streaming, and a LangGraph multi-agent swarm into a single autonomous brain that detects, investigates, and remediates cyber threats in milliseconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="#demo" className="bg-[#111] text-[#E6E8DB] px-8 py-3.5 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#333] transition-all text-center hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:-translate-y-0.5">
              Deploy Exodia →
            </Link>
            <Link href="#how-it-works" className="border-[1.5px] border-[#111] rounded-full px-8 py-3.5 font-bold hover:bg-[#111] hover:text-[#E6E8DB] transition-all text-sm text-center">
              See How It Works
            </Link>
          </div>
          <div className="flex gap-8 items-center opacity-40">
            {['SOC2', 'ISO 27001', 'GDPR', 'HIPAA'].map(b => (
              <span key={b} className="text-xs font-bold tracking-widest uppercase">{b}</span>
            ))}
          </div>
        </Reveal>
        
        {/* Hero Console */}
        <Reveal className="flex-1 w-full" delay={300}>
          <div className="border-[1.5px] border-[#111] rounded-[2rem] p-6 bg-[#F3F4ED] flex flex-col shadow-[6px_6px_0px_#111] hover:shadow-[10px_10px_0px_#111] hover:-translate-y-1.5 hover:-translate-x-1.5 transition-all duration-500">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#111]/10">
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
              <span className="text-xs font-bold opacity-30 tracking-wider">EXODIA LIVE CONSOLE</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="border-[1.5px] border-[#111] rounded-xl p-3"><div className="text-[0.6rem] font-bold tracking-widest opacity-50 mb-1">KAFKA</div><div className="text-xl font-bold">1.2 GB/s</div></div>
              <div className="border-[1.5px] border-[#111] rounded-xl p-3 bg-[#111] text-[#E6E8DB]"><div className="text-[0.6rem] font-bold tracking-widest opacity-50 mb-1">AI SCORE</div><div className="text-xl font-bold">94.7%</div></div>
              <div className="border-[1.5px] border-[#111] rounded-xl p-3"><div className="text-[0.6rem] font-bold tracking-widest opacity-50 mb-1">MTTR</div><div className="text-xl font-bold">340ms</div></div>
            </div>
            <div className="border-[1.5px] border-[#111] rounded-xl p-4 bg-[#111] text-[#E6E8DB] text-xs font-mono space-y-2.5">
              {[
                { time: '14:41:03', type: 'SQL_INJECTION', ip: '203.0.113.45', action: 'BLOCKED', color: 'text-red-400', icon: '✓' },
                { time: '14:41:07', type: 'PORT_SCAN', ip: '198.51.100.12', action: 'ISOLATED', color: 'text-yellow-400', icon: '✓' },
                { time: '14:41:11', type: 'DATA_EXFIL', ip: '10.0.0.88', action: 'HUMAN REVIEW', color: 'text-blue-400', icon: '⧗' },
                { time: '14:41:14', type: 'DDoS_L4', ip: 'AS13335', action: 'RATE LIMITED', color: 'text-red-400', icon: '✓' },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-2 animate-pulse" style={{ animationDelay: `${i * 0.5}s`, animationDuration: '3s' }}>
                  <span className="text-green-400">{e.icon}</span>
                  <span className="opacity-40">{e.time}</span>
                  <span>{e.type} from {e.ip} → <span className={`${e.color} font-bold`}>{e.action}</span></span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="border-y-[1.5px] border-[#111] bg-[#111] text-[#E6E8DB] py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: 340, suffix: 'ms', label: 'MEAN TIME TO REMEDIATE' },
            { val: 25, suffix: '+', label: 'INTEGRATED TOOLS' },
            { val: 99, suffix: '.99%', label: 'UPTIME SLA' },
            { val: 70, suffix: '%', label: 'COST REDUCTION VS HUMAN SOC' },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="text-3xl md:text-4xl font-bold"><Counter end={s.val} suffix={s.suffix} /></div>
              <div className="text-xs tracking-widest opacity-40 mt-2">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ THE PROBLEM ═══ */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="text-xs font-bold tracking-widest opacity-40 mb-4">THE PROBLEM</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight">Your SOC is drowning in 10,000 alerts per day.</h2>
            <p className="opacity-60 font-medium leading-relaxed mb-6">The average Security Operations Center receives over 10,000 alerts daily. Human analysts can investigate fewer than 50. The rest? Ignored. That is where breaches live.</p>
            <p className="opacity-60 font-medium leading-relaxed">Traditional SOAR tried to fix this with static playbooks. But playbooks break when attackers evolve. You need a system that <strong className="text-[#111] opacity-100">reasons</strong>, not one that follows scripts.</p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: '10K+', label: 'DAILY ALERTS', dark: false },
              { val: '<50', label: 'INVESTIGATED', dark: true },
              { val: '287', label: 'DAYS TO DETECT', dark: true },
              { val: '$4.9M', label: 'AVG BREACH COST', dark: false },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 100} className={`border-[1.5px] border-[#111] rounded-2xl p-6 text-center shadow-[3px_3px_0px_#111] hover:shadow-[5px_5px_0px_#111] hover:-translate-y-1 transition-all duration-300 ${c.dark ? 'bg-[#111] text-[#E6E8DB]' : ''}`}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{c.val}</div>
                <div className="text-xs font-bold tracking-widest opacity-50">{c.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 border-t-[1.5px] border-[#111] bg-[#F3F4ED] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="text-center mb-20">
            <div className="text-xs font-bold tracking-widest opacity-40 mb-4">HOW IT WORKS</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">From packet to remediation in 340ms.</h2>
            <p className="text-base opacity-60 font-medium max-w-2xl mx-auto">Every network event flows through a 5-stage intelligent pipeline.</p>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'CAPTURE', desc: 'eBPF kernel sensors intercept raw L3/L4 packets at wire speed. Zero overhead.', icon: '◉' },
              { step: '02', title: 'STREAM', desc: 'Kafka ingests millions of events/sec with Avro schema validation.', icon: '≋' },
              { step: '03', title: 'FILTER', desc: 'Flink drops 70% of noise. Redis cache prevents duplicate analysis.', icon: '⊘' },
              { step: '04', title: 'ANALYZE', desc: 'LangGraph routes to 3 AI agents: Analyst, Remediator, Compliance.', icon: '◈', highlight: true },
              { step: '05', title: 'RESPOND', desc: 'Auto-block via WAF, isolate host, or route to human review.', icon: '⊕' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 120} className={`border-[1.5px] border-[#111] rounded-2xl p-6 flex flex-col shadow-[3px_3px_0px_#111] hover:shadow-[6px_6px_0px_#111] hover:-translate-y-2 transition-all duration-300 cursor-default ${item.highlight ? 'bg-[#111] text-[#E6E8DB]' : 'bg-[#E6E8DB]'}`}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-xs font-bold tracking-widest opacity-40 mb-1">STEP {item.step}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-xs font-medium opacity-60 leading-relaxed flex-1">{item.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-12 border-[1.5px] border-[#111] rounded-2xl p-6 bg-[#E6E8DB] overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] gap-2">
              {['eBPF Sensor', '→', 'Kafka', '→', 'Flink', '→', 'Redis', '→', 'LangGraph', '→', 'SOAR'].map((item, i) => (
                item === '→' ? <div key={i} className="text-xl opacity-20 font-bold">→</div> :
                <div key={i} className="border-[1.5px] border-[#111] rounded-xl px-4 py-3 text-xs font-bold tracking-wider text-center min-w-[80px] bg-[#F3F4ED] hover:bg-[#111] hover:text-[#E6E8DB] transition-all cursor-default">{item}</div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ARCHITECTURE ═══ */}
      <section id="architecture" className="py-24 border-t-[1.5px] border-[#111] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest opacity-40 mb-4">ARCHITECTURE</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">25 tools. One unified brain.</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { emoji: '🧠', sub: 'SUBSYSTEM 1', title: 'The Brain — AI Engine', desc: 'LangGraph orchestrates specialized sub-agents: Threat Analyst queries Qdrant for historical CVEs, Remediator executes SOAR playbooks, Compliance Mapper logs against SOC2/ISO27001. Guardrails layer blocks low-confidence autonomous actions.', tags: ['LangGraph', 'Llama 3.2', 'Qdrant', 'Pinecone', 'Guardrails'], dark: false },
              { emoji: '⚡', sub: 'SUBSYSTEM 2', title: 'The Nervous System — Data Pipeline', desc: 'Kafka provides streaming backbone with Avro schemas. Flink performs real-time enrichment. Redis hot-cache prevents duplicate inference. Debezium CDC captures DB changes. Airflow syncs daily threat intel from NVD and MITRE.', tags: ['Kafka', 'Flink', 'Redis', 'Debezium', 'Airflow'], dark: true },
              { emoji: '👁', sub: 'SUBSYSTEM 3', title: 'The Eyes — Edge & Observability', desc: 'Cilium eBPF agents capture L3/L4 flows at kernel speed. Istio enforces mTLS. Prometheus scrapes AI inference latency. Grafana renders live dashboards. Loki aggregates logs. Tempo traces distributed paths.', tags: ['eBPF', 'Istio', 'Prometheus', 'Grafana', 'Loki'], dark: true },
              { emoji: '🦴', sub: 'SUBSYSTEM 4', title: 'The Skeleton — DevOps & Security', desc: 'Terraform IaC and ArgoCD GitOps for automated deployments. GitHub Actions CI/CD. HashiCorp Vault for secrets. OPA Gatekeeper for zero-trust policies. Keycloak OIDC/SSO for operator access.', tags: ['Terraform', 'ArgoCD', 'Vault', 'OPA', 'Keycloak'], dark: false },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 150} className={`border-[1.5px] border-[#111] rounded-3xl p-8 flex flex-col justify-between min-h-[300px] shadow-[3px_3px_0px_${card.dark ? 'rgba(255,255,255,0.1)' : '#111'}] hover:shadow-[6px_6px_0px_${card.dark ? 'rgba(255,255,255,0.1)' : '#111'}] hover:-translate-y-1 transition-all duration-300 ${card.dark ? 'bg-[#111] text-[#E6E8DB]' : ''}`}>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{card.emoji}</span>
                    <div>
                      <div className="text-xs font-bold tracking-widest opacity-40">{card.sub}</div>
                      <h3 className="text-xl font-bold">{card.title}</h3>
                    </div>
                  </div>
                  <p className="opacity-60 text-sm font-medium leading-relaxed mb-6">{card.desc}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {card.tags.map(t => (
                    <span key={t} className={`px-3 py-1 border-[1.5px] ${card.dark ? 'border-[#E6E8DB]/20' : 'border-[#111]'} rounded-full text-xs font-bold hover:bg-[${card.dark ? '#E6E8DB' : '#111'}] hover:text-[${card.dark ? '#111' : '#E6E8DB'}] transition-colors cursor-default`}>{t}</span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ADVANTAGES ═══ */}
      <section id="advantages" className="py-24 border-t-[1.5px] border-[#111] bg-[#F3F4ED] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest opacity-40 mb-4">WHY EXODIA</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Built different.</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Airgapped AI', desc: 'Runs on local Llama 3.2. No data leaves your network. Deploy on classified networks where cloud AI is forbidden.', hl: true },
              { title: 'Agentic, Not Scripted', desc: 'Unlike legacy SOAR with brittle playbooks, Exodia agents reason through novel threats autonomously.', hl: false },
              { title: 'Sub-Second MTTR', desc: '340ms from malicious packet to firewall rule. No human analyst can match this speed.', hl: false },
              { title: 'Full Pipeline Ownership', desc: 'From kernel-level capture to compliance logging. One vendor. Zero gaps.', hl: false },
              { title: 'Human-in-the-Loop', desc: 'Guardrails block autonomous remediation when confidence is low. Uncertain decisions go to human review.', hl: false },
              { title: 'Open Source Core', desc: 'Inspect every line. No black-box AI. Full audit trail, full transparency.', hl: true },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100} className={`border-[1.5px] border-[#111] rounded-2xl p-8 shadow-[3px_3px_0px_#111] hover:shadow-[6px_6px_0px_#111] hover:-translate-y-2 transition-all duration-300 cursor-default ${item.hl ? 'bg-[#111] text-[#E6E8DB]' : 'bg-[#E6E8DB]'}`}>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-sm font-medium leading-relaxed opacity-60">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ USE CASES ═══ */}
      <section id="use-cases" className="py-24 border-t-[1.5px] border-[#111] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest opacity-40 mb-4">USE CASES</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Who deploys Exodia.</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { industry: 'Financial Services', scenario: 'A tier-1 bank receives 50,000 alerts/day. Exodia triages 95%, blocking credential stuffing in 200ms and routing insider threat signals to fraud teams.', tags: ['PCI-DSS', 'SOC2', 'Real-Time'] },
              { industry: 'Defense & Government', scenario: 'An intelligence agency deploys Exodia on an air-gapped SCIF network. Local Llama 3.2 means zero exfiltration risk. OPA enforces CMMC Level 3 automatically.', tags: ['ITAR', 'Airgapped', 'CMMC'] },
              { industry: 'Healthcare', scenario: 'A hospital monitors east-west traffic between medical IoT. eBPF sensors detect lateral movement targeting patient records and auto-quarantine compromised endpoints.', tags: ['HIPAA', 'IoT', 'PHI'] },
              { industry: 'SaaS / Cloud-Native', scenario: 'A fast-growing startup replaces their 3-person SOC with Exodia. The AI handles L1/L2 triage while one senior analyst focuses on threat hunting.', tags: ['K8s', 'SOC2', 'Cost-Saving'] },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 120} className="border-[1.5px] border-[#111] rounded-3xl p-8 hover:shadow-[4px_4px_0px_#111] hover:-translate-y-1 transition-all duration-300">
                <div className="text-xs font-bold tracking-widest opacity-40 mb-2">{item.industry.toUpperCase()}</div>
                <h3 className="text-xl font-bold mb-4">{item.industry}</h3>
                <p className="opacity-60 text-sm font-medium leading-relaxed mb-6">{item.scenario}</p>
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map(t => <span key={t} className="px-3 py-1 border-[1.5px] border-[#111] rounded-full text-xs font-bold">{t}</span>)}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section className="py-24 border-t-[1.5px] border-[#111] bg-[#F3F4ED] relative z-10">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <Reveal className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest opacity-40 mb-4">COMPARISON</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Exodia vs. Legacy SOAR</h2>
          </Reveal>

          <Reveal className="border-[1.5px] border-[#111] rounded-2xl overflow-hidden shadow-[4px_4px_0px_#111]">
            <div className="grid grid-cols-3 bg-[#111] text-[#E6E8DB] p-4 text-xs font-bold tracking-widest">
              <div>CAPABILITY</div><div className="text-center">LEGACY SOAR</div><div className="text-center">EXODIA</div>
            </div>
            {[
              ['Threat Response', 'Static Playbooks', 'Autonomous AI Agents'],
              ['Novel Attacks', 'Fails (no playbook)', 'Reasons through it'],
              ['MTTR', '30-60 minutes', '340 milliseconds'],
              ['Data Privacy', 'Cloud-dependent', 'Local LLM / Airgapped'],
              ['Maintenance', 'High engineering tax', 'Self-adapting'],
              ['Compliance', 'Manual logging', 'Automatic (SOC2, ISO)'],
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 p-4 text-sm font-medium border-t border-[#111]/10 ${i % 2 === 0 ? '' : 'bg-[#E6E8DB]'} hover:bg-[#111] hover:text-[#E6E8DB] transition-colors cursor-default`}>
                <div className="font-bold">{row[0]}</div>
                <div className="text-center opacity-50">{row[1]}</div>
                <div className="text-center font-bold">{row[2]}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-24 border-t-[1.5px] border-[#111] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest opacity-40 mb-4">PRICING</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Simple, transparent pricing.</h2>
            <p className="text-base opacity-60 font-medium">No per-seat fees. Unlimited analysts.</p>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { tier: 'STARTUP', price: '$499', period: '/mo', desc: 'Starting your automation journey', features: ['1GB/s Kafka Ingest', 'Single AI Agent', '7-Day Retention', 'Community Support'], dark: false, cta: 'Start Free Trial', popular: false },
              { tier: 'ENTERPRISE', price: '$2,499', period: '/mo', desc: 'Full autonomous SOC', features: ['Unlimited Ingest', 'Multi-Agent Swarm', 'Guardrails + HITL', '1-Year Storage', 'Dedicated Engineer'], dark: true, cta: 'Deploy Enterprise', popular: true },
              { tier: 'NATION-STATE', price: 'Custom', period: '', desc: 'Airgapped, on-premise', features: ['On-Prem Install', 'NVIDIA GPU Cluster', 'Custom Playbooks', '24/7 Threat Team', 'FedRAMP / CMMC'], dark: false, cta: 'Contact Sales', popular: false },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 150} className={`border-[1.5px] border-[#111] rounded-[2rem] p-8 flex flex-col shadow-[3px_3px_0px_${plan.dark ? 'rgba(0,0,0,0.3)' : '#111'}] hover:shadow-[6px_6px_0px_${plan.dark ? 'rgba(0,0,0,0.3)' : '#111'}] hover:-translate-y-2 transition-all duration-300 ${plan.dark ? 'bg-[#111] text-[#E6E8DB] md:-translate-y-4' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-xs font-bold tracking-widest ${plan.dark ? '' : 'opacity-50'}`}>{plan.tier}</div>
                  {plan.popular && <span className="text-[0.6rem] font-bold tracking-widest bg-[#E6E8DB] text-[#111] px-3 py-1 rounded-full">POPULAR</span>}
                </div>
                <div className="text-4xl font-bold mb-1">{plan.price}<span className="text-lg font-normal opacity-50">{plan.period}</span></div>
                <p className="text-xs opacity-50 mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8 flex-1 font-medium text-sm">
                  {plan.features.map(f => <li key={f} className="flex items-start gap-2"><span className="mt-0.5 opacity-60">●</span> {f}</li>)}
                </ul>
                <button className={`w-full rounded-full py-3.5 font-bold text-sm transition-all hover:-translate-y-0.5 ${plan.dark ? 'bg-[#E6E8DB] text-[#111] hover:bg-[#D1D4C6]' : 'border-[1.5px] border-[#111] hover:bg-[#111] hover:text-[#E6E8DB]'}`}>{plan.cta}</button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="demo" className="py-24 border-t-[1.5px] border-[#111] bg-[#111] text-[#E6E8DB] relative z-10">
        <Reveal className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">Ready to replace alert fatigue with autonomous intelligence?</h2>
          <p className="text-base opacity-40 font-medium mb-10 max-w-xl mx-auto">Schedule a 30-minute demo. Watch Exodia detect, investigate, and remediate a live SQL injection in real-time.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#" className="bg-[#E6E8DB] text-[#111] px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#D1D4C6] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(230,232,219,0.3)]">Schedule Demo</Link>
            <Link href="#" className="border-[1.5px] border-[#E6E8DB]/20 rounded-full px-10 py-4 font-bold text-sm hover:bg-[#E6E8DB]/10 transition-colors">View on GitHub</Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t-[1.5px] border-[#111] px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold tracking-tight uppercase">EXODIA.</div>
          <div className="flex gap-8 text-xs font-bold tracking-wider opacity-50">
            <span className="hover:opacity-100 transition-opacity cursor-pointer">Documentation</span>
            <span className="hover:opacity-100 transition-opacity cursor-pointer">GitHub</span>
            <span className="hover:opacity-100 transition-opacity cursor-pointer">Blog</span>
            <span className="hover:opacity-100 transition-opacity cursor-pointer">Careers</span>
          </div>
          <div className="text-xs font-medium opacity-30">&copy; 2026 Exodia Enterprise Systems</div>
        </div>
      </footer>
    </div>
  )
}
