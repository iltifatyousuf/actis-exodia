"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

// Animated counter component
function AnimatedCounter({ target, suffix = '' }: { target: string, suffix?: string }) {
  return <span>{target}{suffix}</span>
}

export default function ExodiaLandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <div className="min-h-screen bg-[#E6E8DB] text-[#111111] selection:bg-[#111] selection:text-[#E6E8DB]" style={{ fontFamily: "'Space Grotesk', monospace" }}>
      
      {/* Navbar */}
      <nav className="fixed w-full top-0 bg-[#E6E8DB]/90 backdrop-blur-md border-b-[1.5px] border-[#111111] z-50 px-6 md:px-12 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tight uppercase">EXODIA.</div>
        <div className="hidden md:flex gap-8 font-semibold text-sm tracking-wide">
          <Link href="#how-it-works" className="hover:opacity-60 transition-opacity">How it Works</Link>
          <Link href="#architecture" className="hover:opacity-60 transition-opacity">Architecture</Link>
          <Link href="#advantages" className="hover:opacity-60 transition-opacity">Why Exodia</Link>
          <Link href="#use-cases" className="hover:opacity-60 transition-opacity">Use Cases</Link>
          <Link href="#pricing" className="hover:opacity-60 transition-opacity">Pricing</Link>
        </div>
        <Link href="#demo" className="hidden md:block bg-[#111111] text-[#E6E8DB] px-6 py-2.5 rounded-full font-bold uppercase text-xs hover:bg-[#333] transition-colors tracking-wider">
          Request Demo
        </Link>
        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden flex flex-col gap-1.5">
          <div className="w-6 h-[2px] bg-[#111]"></div>
          <div className="w-6 h-[2px] bg-[#111]"></div>
          <div className="w-6 h-[2px] bg-[#111]"></div>
        </button>
      </nav>

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="pt-32 md:pt-44 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 border-[1.5px] border-[#111] rounded-full px-4 py-1.5 text-xs font-bold mb-8 tracking-wider">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            V2.0 — MULTI-AGENT ARCHITECTURE
          </div>
          <h1 className="text-4xl md:text-[4.5rem] font-bold tracking-tighter leading-[0.92] mb-6">
            Your SOC Team.<br />Replaced by AI Agents.
          </h1>
          <p className="text-base md:text-lg font-medium opacity-70 mb-10 max-w-lg leading-relaxed">
            Exodia fuses eBPF kernel sensors, real-time Kafka streaming, and a LangGraph multi-agent swarm into a single autonomous brain that detects, investigates, and remediates cyber threats in milliseconds — not hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="#demo" className="bg-[#111] text-[#E6E8DB] px-8 py-3.5 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#333] transition-colors text-center">
              Deploy Exodia →
            </Link>
            <Link href="#how-it-works" className="border-[1.5px] border-[#111] rounded-full px-8 py-3.5 font-bold hover:bg-[#111] hover:text-[#E6E8DB] transition-all text-sm text-center">
              See How It Works
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex gap-8 items-center opacity-50">
            <span className="text-xs font-bold tracking-widest uppercase">SOC2 Compliant</span>
            <span className="text-xs font-bold tracking-widest uppercase">ISO 27001</span>
            <span className="text-xs font-bold tracking-widest uppercase">GDPR Ready</span>
          </div>
        </div>
        
        {/* Hero Graphic */}
        <div className="flex-1 w-full relative">
          <div className="border-[1.5px] border-[#111] rounded-[2rem] p-6 bg-[#F3F4ED] flex flex-col shadow-[6px_6px_0px_#111] hover:shadow-[8px_8px_0px_#111] hover:-translate-y-1 hover:-translate-x-1 transition-all">
            {/* Terminal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#111]/10">
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs font-bold opacity-40 tracking-wider">EXODIA LIVE CONSOLE</span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="border-[1.5px] border-[#111] rounded-xl p-3">
                <div className="text-[0.6rem] font-bold tracking-widest opacity-60 mb-1">KAFKA INGEST</div>
                <div className="text-xl font-bold">1.2 GB/s</div>
              </div>
              <div className="border-[1.5px] border-[#111] rounded-xl p-3 bg-[#111] text-[#E6E8DB]">
                <div className="text-[0.6rem] font-bold tracking-widest opacity-60 mb-1">AI CONFIDENCE</div>
                <div className="text-xl font-bold">94.7%</div>
              </div>
              <div className="border-[1.5px] border-[#111] rounded-xl p-3">
                <div className="text-[0.6rem] font-bold tracking-widest opacity-60 mb-1">MTTR</div>
                <div className="text-xl font-bold">340ms</div>
              </div>
            </div>
            
            {/* Live Feed */}
            <div className="border-[1.5px] border-[#111] rounded-xl p-4 bg-[#111] text-[#E6E8DB] text-xs font-mono space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="opacity-60">14:41:03</span>
                <span>SQL_INJECTION from 203.0.113.45 → <span className="text-red-400 font-bold">BLOCKED</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="opacity-60">14:41:07</span>
                <span>PORT_SCAN from 198.51.100.12 → <span className="text-yellow-400 font-bold">ISOLATED</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">⧗</span>
                <span className="opacity-60">14:41:11</span>
                <span>DATA_EXFIL low confidence → <span className="text-blue-400 font-bold">HUMAN REVIEW</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="opacity-60">14:41:14</span>
                <span>DDoS_L4 from AS13335 → <span className="text-red-400 font-bold">RATE LIMITED</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* STATS BAR */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="border-y-[1.5px] border-[#111] bg-[#111] text-[#E6E8DB] py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold">340ms</div>
            <div className="text-xs tracking-widest opacity-60 mt-1">MEAN TIME TO REMEDIATE</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">25+</div>
            <div className="text-xs tracking-widest opacity-60 mt-1">INTEGRATED TOOLS</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">99.99%</div>
            <div className="text-xs tracking-widest opacity-60 mt-1">UPTIME SLA</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">70%</div>
            <div className="text-xs tracking-widest opacity-60 mt-1">COST REDUCTION VS HUMAN SOC</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* THE PROBLEM */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs font-bold tracking-widest opacity-50 mb-4">THE PROBLEM</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight">Your SOC is drowning in 10,000 alerts per day.</h2>
            <p className="opacity-70 font-medium leading-relaxed mb-6">
              The average Security Operations Center receives over 10,000 alerts daily. Human analysts can realistically investigate fewer than 50. The rest? Ignored. That is where breaches happen.
            </p>
            <p className="opacity-70 font-medium leading-relaxed">
              Traditional SOAR platforms tried to fix this with static playbooks. But playbooks break when attackers change tactics. You need a system that <strong className="text-[#111]">reasons</strong>, not one that follows scripts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-[1.5px] border-[#111] rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-xs font-bold tracking-widest opacity-60">DAILY ALERTS</div>
            </div>
            <div className="border-[1.5px] border-[#111] rounded-2xl p-6 text-center bg-[#111] text-[#E6E8DB]">
              <div className="text-4xl font-bold mb-2">&lt;50</div>
              <div className="text-xs font-bold tracking-widest opacity-60">INVESTIGATED BY HUMANS</div>
            </div>
            <div className="border-[1.5px] border-[#111] rounded-2xl p-6 text-center bg-[#111] text-[#E6E8DB]">
              <div className="text-4xl font-bold mb-2">287</div>
              <div className="text-xs font-bold tracking-widest opacity-60">DAYS AVG BREACH DETECTION</div>
            </div>
            <div className="border-[1.5px] border-[#111] rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">$4.9M</div>
              <div className="text-xs font-bold tracking-widest opacity-60">AVG BREACH COST</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* HOW IT WORKS — STEP BY STEP */}
      {/* ═══════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 border-t-[1.5px] border-[#111] bg-[#F3F4ED]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <div className="text-xs font-bold tracking-widest opacity-50 mb-4">HOW IT WORKS</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">From packet to remediation in 340ms.</h2>
            <p className="text-base opacity-70 font-medium max-w-2xl mx-auto">Every network event flows through a 5-stage intelligent pipeline. No human intervention required for 95% of threats.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'CAPTURE', desc: 'eBPF kernel sensors intercept raw L3/L4 network packets at wire speed. Zero overhead. Zero blind spots.', icon: '◉' },
              { step: '02', title: 'STREAM', desc: 'Apache Kafka ingests millions of events/sec into a durable, fault-tolerant stream with Avro schema validation.', icon: '≋' },
              { step: '03', title: 'FILTER', desc: 'Apache Flink drops 70% of benign noise in real-time. Redis hot-cache prevents duplicate analysis of known IPs.', icon: '⊘' },
              { step: '04', title: 'ANALYZE', desc: 'LangGraph routes the threat to 3 specialized AI agents: Threat Analyst, SOAR Remediator, and Compliance Mapper.', icon: '◈' },
              { step: '05', title: 'RESPOND', desc: 'Auto-block via Cloudflare WAF, isolate via Palo Alto, or route to human review queue if confidence is low.', icon: '⊕' },
            ].map((item, i) => (
              <div key={i} className={`border-[1.5px] border-[#111] rounded-2xl p-6 flex flex-col shadow-[3px_3px_0px_#111] ${i === 3 ? 'bg-[#111] text-[#E6E8DB]' : 'bg-[#E6E8DB]'}`}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-xs font-bold tracking-widest opacity-50 mb-1">STEP {item.step}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-xs font-medium opacity-70 leading-relaxed flex-1">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Flow Diagram */}
          <div className="mt-12 border-[1.5px] border-[#111] rounded-2xl p-6 bg-[#E6E8DB] overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] gap-2">
              {['eBPF Sensor', '→', 'Kafka Cluster', '→', 'Flink Filter', '→', 'Redis Cache', '→', 'LangGraph AI', '→', 'SOAR Action'].map((item, i) => (
                item === '→' ? 
                  <div key={i} className="text-xl opacity-30 font-bold">→</div> :
                  <div key={i} className="border-[1.5px] border-[#111] rounded-xl px-4 py-3 text-xs font-bold tracking-wider text-center min-w-[90px] bg-[#F3F4ED]">
                    {item}
                  </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* ARCHITECTURE DEEP DIVE */}
      {/* ═══════════════════════════════════════════════ */}
      <section id="architecture" className="py-24 border-t-[1.5px] border-[#111]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest opacity-50 mb-4">ARCHITECTURE</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">25 tools. One unified brain.</h2>
            <p className="text-base opacity-70 font-medium max-w-2xl mx-auto">Four interconnected subsystems working in perfect synchrony.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Brain */}
            <div className="border-[1.5px] border-[#111] rounded-3xl p-8 flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 border-[1.5px] border-[#111] flex items-center justify-center text-lg">🧠</div>
                  <div>
                    <div className="text-xs font-bold tracking-widest opacity-50">SUBSYSTEM 1</div>
                    <h3 className="text-xl font-bold">The Brain — AI Engine</h3>
                  </div>
                </div>
                <p className="opacity-70 text-sm font-medium leading-relaxed mb-4">
                  A LangGraph state machine orchestrates a swarm of specialized sub-agents. The Threat Analyst queries the Qdrant vector database for historical context. The Remediator executes SOAR playbooks. The Compliance Mapper logs every action against SOC2/ISO27001 controls.
                </p>
                <p className="opacity-70 text-sm font-medium leading-relaxed mb-6">
                  An AI Guardrails layer evaluates confidence scores before allowing autonomous remediation. Low-confidence decisions are routed to a human review queue.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['LangGraph', 'Llama 3.2', 'Qdrant', 'Pinecone', 'Guardrails'].map(t => (
                  <span key={t} className="px-3 py-1 border-[1.5px] border-[#111] rounded-full text-xs font-bold">{t}</span>
                ))}
              </div>
            </div>

            {/* The Nervous System */}
            <div className="border-[1.5px] border-[#111] rounded-3xl p-8 flex flex-col justify-between min-h-[320px] bg-[#111] text-[#E6E8DB]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-900 border-[1.5px] border-[#E6E8DB]/30 flex items-center justify-center text-lg">⚡</div>
                  <div>
                    <div className="text-xs font-bold tracking-widest opacity-50">SUBSYSTEM 2</div>
                    <h3 className="text-xl font-bold">The Nervous System — Data Pipeline</h3>
                  </div>
                </div>
                <p className="opacity-70 text-sm font-medium leading-relaxed mb-4">
                  Apache Kafka provides the streaming backbone with guaranteed delivery and Avro schema validation. Apache Flink performs real-time enrichment, dropping 70% of benign noise before it reaches the AI.
                </p>
                <p className="opacity-70 text-sm font-medium leading-relaxed mb-6">
                  Redis hot-cache prevents duplicate LLM inference on repeat attackers. Debezium CDC captures database changes as live streams. Apache Airflow orchestrates daily threat intel syncs from NVD, MITRE, and VirusTotal.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['Kafka', 'Flink', 'Redis', 'Debezium', 'Airflow'].map(t => (
                  <span key={t} className="px-3 py-1 border-[1.5px] border-[#E6E8DB]/30 rounded-full text-xs font-bold">{t}</span>
                ))}
              </div>
            </div>

            {/* The Eyes */}
            <div className="border-[1.5px] border-[#111] rounded-3xl p-8 flex flex-col justify-between min-h-[320px] bg-[#111] text-[#E6E8DB]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-900 border-[1.5px] border-[#E6E8DB]/30 flex items-center justify-center text-lg">👁</div>
                  <div>
                    <div className="text-xs font-bold tracking-widest opacity-50">SUBSYSTEM 3</div>
                    <h3 className="text-xl font-bold">The Eyes — Edge & Observability</h3>
                  </div>
                </div>
                <p className="opacity-70 text-sm font-medium leading-relaxed mb-4">
                  Cilium eBPF agents run as DaemonSets on every Kubernetes node, capturing L3/L4 network flows at kernel speed with zero application overhead. Istio service mesh enforces mTLS between all microservices.
                </p>
                <p className="opacity-70 text-sm font-medium leading-relaxed mb-6">
                  Prometheus scrapes AI inference latency and threat counters. Grafana renders real-time dashboards. Loki aggregates logs. Tempo traces distributed request paths across the entire pipeline.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['eBPF/Cilium', 'Istio', 'Prometheus', 'Grafana', 'Loki'].map(t => (
                  <span key={t} className="px-3 py-1 border-[1.5px] border-[#E6E8DB]/30 rounded-full text-xs font-bold">{t}</span>
                ))}
              </div>
            </div>

            {/* The Skeleton */}
            <div className="border-[1.5px] border-[#111] rounded-3xl p-8 flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 border-[1.5px] border-[#111] flex items-center justify-center text-lg">🦴</div>
                  <div>
                    <div className="text-xs font-bold tracking-widest opacity-50">SUBSYSTEM 4</div>
                    <h3 className="text-xl font-bold">The Skeleton — DevOps & Security</h3>
                  </div>
                </div>
                <p className="opacity-70 text-sm font-medium leading-relaxed mb-4">
                  Infrastructure is defined as code with Terraform and deployed via ArgoCD GitOps. GitHub Actions runs CI/CD on every push — linting, building, and rolling out new AI models automatically.
                </p>
                <p className="opacity-70 text-sm font-medium leading-relaxed mb-6">
                  HashiCorp Vault manages secrets and PKI certificates. OPA Gatekeeper enforces zero-trust policies. Keycloak provides OIDC/SSO for the operator dashboard.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['Terraform', 'ArgoCD', 'Vault', 'OPA', 'Keycloak'].map(t => (
                  <span key={t} className="px-3 py-1 border-[1.5px] border-[#111] rounded-full text-xs font-bold">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* ADVANTAGES */}
      {/* ═══════════════════════════════════════════════ */}
      <section id="advantages" className="py-24 border-t-[1.5px] border-[#111] bg-[#F3F4ED]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest opacity-50 mb-4">WHY EXODIA</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Built different.</h2>
            <p className="text-base opacity-70 font-medium max-w-2xl mx-auto">What separates Exodia from legacy SOAR platforms and AI wrappers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Airgapped AI',
                desc: 'Runs entirely on local Llama 3.2 models. No data ever leaves your network. Deploy on classified networks, air-gapped environments, and ITAR-regulated facilities where cloud AI is forbidden.',
                highlight: true
              },
              {
                title: 'Agentic, Not Scripted',
                desc: 'Unlike legacy SOAR that follows brittle playbooks, Exodia agents reason through novel threats autonomously. When a new attack variant appears, the AI adapts — no playbook update needed.',
                highlight: false
              },
              {
                title: 'Sub-Second MTTR',
                desc: '340ms mean time to remediate. From the moment a malicious packet hits the wire to the moment the firewall rule is deployed. No human analyst can match this speed.',
                highlight: false
              },
              {
                title: 'Full Pipeline Ownership',
                desc: 'Most competitors handle one layer. Exodia owns the entire pipeline from kernel-level packet capture (eBPF) to compliance logging (Splunk). One vendor. One contract. Zero gaps.',
                highlight: false
              },
              {
                title: 'Human-in-the-Loop',
                desc: 'The Guardrails layer prevents the AI from auto-remediating when confidence is below threshold. Uncertain decisions are routed to human SOC analysts via Jira/Slack for manual approval.',
                highlight: false
              },
              {
                title: 'Open Source Core',
                desc: 'Inspect every line of code. No black-box AI making decisions about your network. Full audit trail, full transparency, full control. Enterprise support contracts available.',
                highlight: true
              },
            ].map((item, i) => (
              <div key={i} className={`border-[1.5px] border-[#111] rounded-2xl p-8 shadow-[3px_3px_0px_#111] ${item.highlight ? 'bg-[#111] text-[#E6E8DB]' : 'bg-[#E6E8DB]'}`}>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className={`text-sm font-medium leading-relaxed ${item.highlight ? 'opacity-80' : 'opacity-70'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* USE CASES */}
      {/* ═══════════════════════════════════════════════ */}
      <section id="use-cases" className="py-24 border-t-[1.5px] border-[#111]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest opacity-50 mb-4">USE CASES</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Who deploys Exodia.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { industry: 'Financial Services', scenario: 'A tier-1 bank receives 50,000 alerts/day from their WAF. Exodia autonomously triages 95% of them, blocking credential stuffing attacks in 200ms and routing insider threat signals to their fraud team.', tags: ['PCI-DSS', 'SOC2', 'Real-Time'] },
              { industry: 'Defense & Government', scenario: 'An intelligence agency deploys Exodia on an air-gapped SCIF network. Local Llama 3.2 inference means zero data exfiltration risk. OPA policies enforce CMMC Level 3 compliance automatically.', tags: ['ITAR', 'Airgapped', 'CMMC'] },
              { industry: 'Healthcare', scenario: 'A hospital network uses Exodia to monitor east-west traffic between medical IoT devices. The eBPF sensors detect lateral movement attempts targeting patient records and auto-quarantine compromised endpoints.', tags: ['HIPAA', 'IoT', 'PHI Protection'] },
              { industry: 'SaaS / Cloud-Native', scenario: 'A fast-growing SaaS company replaces their 3-person SOC team with Exodia. The AI handles L1/L2 triage autonomously while the single remaining senior analyst focuses on threat hunting and architecture.', tags: ['Cost Reduction', 'SOC2', 'Kubernetes'] },
            ].map((item, i) => (
              <div key={i} className="border-[1.5px] border-[#111] rounded-3xl p-8">
                <div className="text-xs font-bold tracking-widest opacity-50 mb-2">{item.industry.toUpperCase()}</div>
                <h3 className="text-xl font-bold mb-4">{item.industry}</h3>
                <p className="opacity-70 text-sm font-medium leading-relaxed mb-6">{item.scenario}</p>
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map(t => (
                    <span key={t} className="px-3 py-1 border-[1.5px] border-[#111] rounded-full text-xs font-bold">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* COMPARISON TABLE */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 border-t-[1.5px] border-[#111] bg-[#F3F4ED]">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest opacity-50 mb-4">COMPARISON</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Exodia vs. Legacy SOAR</h2>
          </div>

          <div className="border-[1.5px] border-[#111] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-[#111] text-[#E6E8DB] p-4 text-xs font-bold tracking-widest">
              <div>CAPABILITY</div>
              <div className="text-center">LEGACY SOAR</div>
              <div className="text-center">EXODIA</div>
            </div>
            {[
              ['Threat Response', 'Static Playbooks', 'Autonomous AI Agents'],
              ['Novel Attack Handling', 'Fails (no playbook)', 'Reasons through it'],
              ['Mean Time to Respond', '30-60 minutes', '340 milliseconds'],
              ['Data Privacy', 'Cloud-dependent', 'Local LLM / Airgapped'],
              ['Maintenance Cost', 'High (playbook engineering)', 'Self-adapting'],
              ['Compliance Logging', 'Manual', 'Automatic (SOC2, ISO27001)'],
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 p-4 text-sm font-medium border-t border-[#111]/10 ${i % 2 === 0 ? '' : 'bg-[#E6E8DB]'}`}>
                <div className="font-bold">{row[0]}</div>
                <div className="text-center opacity-60">{row[1]}</div>
                <div className="text-center font-bold">{row[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* PRICING */}
      {/* ═══════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 border-t-[1.5px] border-[#111]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest opacity-50 mb-4">PRICING</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Simple, transparent pricing.</h2>
            <p className="text-base opacity-70 font-medium">No per-seat fees. No per-alert charges. Unlimited analysts.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-[1.5px] border-[#111] rounded-[2rem] p-8 flex flex-col">
              <div className="text-xs font-bold tracking-widest opacity-50 mb-2">STARTUP</div>
              <div className="text-4xl font-bold mb-2">$499<span className="text-lg font-normal opacity-60">/mo</span></div>
              <p className="text-xs opacity-60 mb-6">For teams starting their automation journey</p>
              <ul className="space-y-3 mb-8 flex-1 font-medium text-sm">
                <li className="flex items-start gap-2"><span className="mt-1">●</span> Up to 1GB/s Kafka Ingest</li>
                <li className="flex items-start gap-2"><span className="mt-1">●</span> Single AI Agent</li>
                <li className="flex items-start gap-2"><span className="mt-1">●</span> 7-Day Log Retention</li>
                <li className="flex items-start gap-2"><span className="mt-1">●</span> Community Support</li>
              </ul>
              <button className="w-full border-[1.5px] border-[#111] rounded-full py-3.5 font-bold hover:bg-[#111] hover:text-[#E6E8DB] transition-colors text-sm">Start Free Trial</button>
            </div>

            <div className="border-[1.5px] border-[#111] rounded-[2rem] p-8 flex flex-col bg-[#111] text-[#E6E8DB] shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transform md:-translate-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold tracking-widest">ENTERPRISE</div>
                <span className="text-[0.6rem] font-bold tracking-widest bg-[#E6E8DB] text-[#111] px-3 py-1 rounded-full">MOST POPULAR</span>
              </div>
              <div className="text-4xl font-bold mb-2">$2,499<span className="text-lg font-normal opacity-60">/mo</span></div>
              <p className="text-xs opacity-60 mb-6">For security teams that need full autonomy</p>
              <ul className="space-y-3 mb-8 flex-1 font-medium text-sm">
                <li className="flex items-start gap-2"><span className="mt-1">●</span> Unlimited Kafka Ingest</li>
                <li className="flex items-start gap-2"><span className="mt-1">●</span> Full Multi-Agent Swarm</li>
                <li className="flex items-start gap-2"><span className="mt-1">●</span> AI Guardrails + Human-in-Loop</li>
                <li className="flex items-start gap-2"><span className="mt-1">●</span> 1-Year Qdrant + Pinecone Storage</li>
                <li className="flex items-start gap-2"><span className="mt-1">●</span> Dedicated Support Engineer</li>
              </ul>
              <button className="w-full rounded-full py-3.5 font-bold bg-[#E6E8DB] text-[#111] hover:bg-[#D1D4C6] transition-colors text-sm">Deploy Enterprise</button>
            </div>

            <div className="border-[1.5px] border-[#111] rounded-[2rem] p-8 flex flex-col">
              <div className="text-xs font-bold tracking-widest opacity-50 mb-2">NATION-STATE</div>
              <div className="text-4xl font-bold mb-2">Custom</div>
              <p className="text-xs opacity-60 mb-6">Air-gapped, on-premise, classified</p>
              <ul className="space-y-3 mb-8 flex-1 font-medium text-sm">
                <li className="flex items-start gap-2"><span className="mt-1">●</span> On-Premise Airgapped Install</li>
                <li className="flex items-start gap-2"><span className="mt-1">●</span> Dedicated NVIDIA GPU Cluster</li>
                <li className="flex items-start gap-2"><span className="mt-1">●</span> Custom SOAR Playbooks</li>
                <li className="flex items-start gap-2"><span className="mt-1">●</span> 24/7 Threat Hunting Team</li>
                <li className="flex items-start gap-2"><span className="mt-1">●</span> FedRAMP / CMMC Compliance</li>
              </ul>
              <button className="w-full border-[1.5px] border-[#111] rounded-full py-3.5 font-bold hover:bg-[#111] hover:text-[#E6E8DB] transition-colors text-sm">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* CTA */}
      {/* ═══════════════════════════════════════════════ */}
      <section id="demo" className="py-24 border-t-[1.5px] border-[#111] bg-[#111] text-[#E6E8DB]">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">Ready to replace alert fatigue with autonomous intelligence?</h2>
          <p className="text-base opacity-60 font-medium mb-10 max-w-xl mx-auto">Schedule a 30-minute demo. We will show you Exodia detecting, investigating, and remediating a live SQL injection attack in real-time.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#" className="bg-[#E6E8DB] text-[#111] px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#D1D4C6] transition-colors">
              Schedule Demo
            </Link>
            <Link href="#" className="border-[1.5px] border-[#E6E8DB]/30 rounded-full px-10 py-4 font-bold text-sm hover:bg-[#E6E8DB]/10 transition-colors">
              View on GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t-[1.5px] border-[#111] px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold tracking-tight uppercase">EXODIA.</div>
          <div className="flex gap-8 text-xs font-bold tracking-wider opacity-60">
            <span>Documentation</span>
            <span>GitHub</span>
            <span>Blog</span>
            <span>Careers</span>
          </div>
          <div className="text-xs font-medium opacity-40">&copy; 2026 Exodia Enterprise Systems</div>
        </div>
      </footer>
    </div>
  )
}
