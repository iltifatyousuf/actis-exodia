"use client"
import React from 'react'
import Link from 'next/link'

export default function ExodiaLandingPage() {
  return (
    <div className="min-h-screen bg-[#E6E8DB] text-[#111111] font-mono selection:bg-[#111] selection:text-[#E6E8DB]">
      
      {/* Navbar */}
      <nav className="fixed w-full top-0 bg-[#E6E8DB]/90 backdrop-blur-md border-b-[1.5px] border-[#111111] z-50 px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tight uppercase">EXODIA.</div>
        <div className="hidden md:flex gap-8 font-semibold text-sm tracking-wide">
          <Link href="#how-it-works" className="hover:opacity-60 transition-opacity">How it Works</Link>
          <Link href="#services" className="hover:opacity-60 transition-opacity">Architecture</Link>
          <Link href="#pricing" className="hover:opacity-60 transition-opacity">Pricing</Link>
        </div>
        <Link href="#demo" className="bg-[#111111] text-[#E6E8DB] px-6 py-2 rounded-full font-bold uppercase text-xs hover:bg-[#333] transition-colors">
          Request Demo
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="inline-block border-[1.5px] border-[#111] rounded-full px-4 py-1 text-xs font-bold mb-6 tracking-wide">
            V2.0 MULTI-AGENT ARCHITECTURE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
            The Autonomous <br />Security Operations Center.
          </h1>
          <p className="text-lg md:text-xl font-medium opacity-80 mb-8 max-w-lg leading-snug">
            Stop managing 25+ fragmented security tools. Exodia fuses eBPF networks, Kafka streaming, and a LangGraph Multi-Agent AI into a single, unified brain.
          </p>
          <div className="flex gap-4">
            <Link href="#demo" className="bg-[#111] text-[#E6E8DB] px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-[#333] transition-colors">
              Deploy Exodia
            </Link>
            <Link href="#docs" className="border-[1.5px] border-[#111] rounded-full px-8 py-3 font-bold hover:bg-[#111] hover:text-[#E6E8DB] transition-all">
              Read the Docs
            </Link>
          </div>
        </div>
        
        {/* Hero Graphic (Mini Dashboard) */}
        <div className="flex-1 w-full relative">
          <div className="border-[1.5px] border-[#111] rounded-[2rem] p-6 bg-[#F3F4ED] h-[400px] flex flex-col shadow-[4px_4px_0px_#111] hover:shadow-[6px_6px_0px_#111] hover:-translate-y-1 hover:-translate-x-1 transition-all">
            <div className="flex justify-between items-center mb-8 border-b-[1.5px] border-[#111]/20 pb-4">
              <div className="font-bold tracking-tight text-xl uppercase">Live Threat Ingestion</div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-black"></div>
                <div className="w-3 h-3 rounded-full border-[1.5px] border-[#111]"></div>
              </div>
            </div>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1 border-[1.5px] border-[#111] rounded-2xl p-4">
                <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2">KAFKA STREAM</div>
                <div className="text-3xl font-bold">1,204 <span className="text-sm font-normal">MB/s</span></div>
              </div>
              <div className="flex-1 border-[1.5px] border-[#111] rounded-2xl p-4 bg-[#111] text-[#E6E8DB]">
                <div className="text-xs uppercase tracking-widest font-bold mb-2">AI CONFIDENCE</div>
                <div className="text-3xl font-bold">87.4%</div>
              </div>
            </div>
            
            <div className="border-[1.5px] border-[#111] rounded-2xl p-4 flex-1 flex flex-col justify-center relative overflow-hidden">
              <div className="text-xs uppercase tracking-widest font-bold mb-1 relative z-10">ACTIVE SOAR MITIGATION</div>
              <div className="font-medium relative z-10">Isolating Host: 192.168.1.45 via Cloudflare WAF</div>
              <div className="w-full h-2 border-[1.5px] border-[#111] rounded-full mt-4 relative z-10 bg-[#E6E8DB]">
                <div className="w-[68%] h-full bg-[#111] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 border-t-[1.5px] border-[#111] bg-[#F3F4ED]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:w-2/3">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">How it works.</h2>
            <p className="text-lg opacity-80 font-medium">The traditional SOC is dead. Alert fatigue is replaced by real-time stream enrichment and a swarm of specialized AI agents acting in milliseconds.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-[1.5px] border-[#111] shadow-[4px_4px_0px_#111] rounded-[2rem] p-8 bg-[#E6E8DB]">
              <div className="text-5xl font-bold mb-4">01.</div>
              <h3 className="text-xl font-bold mb-2">Listen at the Edge.</h3>
              <p className="opacity-80 text-sm font-medium">Cilium eBPF sensors and Istio sidecars capture raw L3/L4 network packets and route them into a high-throughput Apache Kafka cluster.</p>
            </div>
            <div className="border-[1.5px] border-[#111] shadow-[4px_4px_0px_#111] rounded-[2rem] p-8 bg-[#111] text-[#E6E8DB]">
              <div className="text-5xl font-bold mb-4">02.</div>
              <h3 className="text-xl font-bold mb-2">Filter the Noise.</h3>
              <p className="opacity-80 text-sm font-medium">Apache Flink intercepts the Kafka firehose, instantly dropping benign traffic and checking Redis hot-caches before waking up the AI.</p>
            </div>
            <div className="border-[1.5px] border-[#111] shadow-[4px_4px_0px_#111] rounded-[2rem] p-8 bg-[#E6E8DB]">
              <div className="text-5xl font-bold mb-4">03.</div>
              <h3 className="text-xl font-bold mb-2">The Multi-Agent Brain.</h3>
              <p className="opacity-80 text-sm font-medium">A LangGraph Supervisor routes the threat to specialized Sub-Agents. They query Qdrant for context, execute SOAR playbooks, and log compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Architecture Section */}
      <section id="services" className="py-24 border-t-[1.5px] border-[#111]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-12 text-center">Consolidating 25+ Tools.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-[1.5px] border-[#111] rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-4">THE BRAIN</div>
                <h3 className="text-2xl font-bold mb-2">LangGraph Orchestrator</h3>
                <p className="opacity-80 mb-6 text-sm font-medium">Not just a chatbot. Exodia uses an army of Llama 3.2 agents. Threat Analysts, SOAR Remediators, and SOC2 Compliance mappers working in perfect synchrony.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 border-[1.5px] border-[#111] rounded-full text-xs font-bold">Llama 3.2</span>
                <span className="px-3 py-1 border-[1.5px] border-[#111] rounded-full text-xs font-bold">LangGraph</span>
              </div>
            </div>

            <div className="border-[1.5px] border-[#111] rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-4">THE NETWORK</div>
                <h3 className="text-2xl font-bold mb-2">Streaming Backbone</h3>
                <p className="opacity-80 mb-6 text-sm font-medium">Zero-trust architecture powered by eBPF. We ingest millions of events per second with zero data loss, guaranteed by Avro schemas.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 border-[1.5px] border-[#111] rounded-full text-xs font-bold">Apache Kafka</span>
                <span className="px-3 py-1 border-[1.5px] border-[#111] rounded-full text-xs font-bold">Apache Flink</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t-[1.5px] border-[#111] bg-[#F3F4ED]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Simple Pricing.</h2>
            <p className="text-lg opacity-80 font-medium">Scale from a single Kubernetes cluster to a multi-region global mesh.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-[1.5px] border-[#111] rounded-[2rem] p-8 flex flex-col">
              <div className="text-xs uppercase tracking-widest font-bold mb-2">STARTUP</div>
              <div className="text-4xl font-bold mb-6">$499<span className="text-lg font-normal opacity-60">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1 font-medium text-sm">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#111] rounded-full"></div> Up to 1GB/s Kafka Ingest</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#111] rounded-full"></div> Single-Agent Brain</li>
              </ul>
              <button className="w-full border-[1.5px] border-[#111] rounded-full py-3 font-bold hover:bg-[#111] hover:text-[#E6E8DB] transition-colors">Start Free Trial</button>
            </div>

            <div className="border-[1.5px] border-[#111] rounded-[2rem] p-8 flex flex-col bg-[#111] text-[#E6E8DB] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transform md:-translate-y-4">
              <div className="text-xs uppercase tracking-widest font-bold mb-2 text-[#E6E8DB]">ENTERPRISE</div>
              <div className="text-4xl font-bold mb-6">$2,499<span className="text-lg font-normal opacity-60">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1 font-medium text-sm">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#E6E8DB] rounded-full"></div> Unlimited Kafka Ingest</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#E6E8DB] rounded-full"></div> Full Multi-Agent Swarm</li>
              </ul>
              <button className="w-full rounded-full py-3 font-bold bg-[#E6E8DB] text-[#111] hover:bg-[#D1D4C6] transition-colors">Deploy Enterprise</button>
            </div>

            <div className="border-[1.5px] border-[#111] rounded-[2rem] p-8 flex flex-col">
              <div className="text-xs uppercase tracking-widest font-bold mb-2">NATION-STATE</div>
              <div className="text-4xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 mb-8 flex-1 font-medium text-sm">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#111] rounded-full"></div> On-Premise Airgapped Install</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#111] rounded-full"></div> Dedicated NVIDIA GPUs</li>
              </ul>
              <button className="w-full border-[1.5px] border-[#111] rounded-full py-3 font-bold hover:bg-[#111] hover:text-[#E6E8DB] transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t-[1.5px] border-[#111] text-center text-sm font-medium opacity-80">
        &copy; 2026 Exodia Enterprise Systems. All rights reserved.
      </footer>
    </div>
  )
}
