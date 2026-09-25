"use client"
import React, { useState } from 'react'

export default function ExodiaDashboard() {
  const [rules, setRules] = useState([
    { id: 1, vector: 'SQL_INJECTION', confidence: '> 80%', action: 'GLOBAL_WAF', playbook: 'BLOCK_IP_ADDRESS', enabled: false },
    { id: 2, vector: 'PORT_SCAN', confidence: '> 65%', action: 'HONEYPOT', playbook: 'ISOLATE_HOST', enabled: true },
    { id: 3, vector: 'DDoS_ATTACK', confidence: '> 92%', action: 'CLOUDFLARE', playbook: 'RATE_LIMIT_ASN', enabled: true },
    { id: 4, vector: 'DATA_EXFILTRATION', confidence: '< 80%', action: 'HUMAN-IN-THE-LOOP', playbook: 'REVIEW QUEUE', enabled: true },
  ])

  const toggleRule = (id: number) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  return (
    <div className="min-h-screen bg-[#F3F4ED] text-[#222] font-mono flex items-center justify-center p-8">
      <div className="bg-[#E6E8DB] w-full max-w-7xl min-h-[750px] rounded-[40px] border-2 border-[#D1D4C6] p-10 flex flex-col shadow-[inset_0_0_10px_rgba(255,255,255,0.5),20px_20px_60px_rgba(0,0,0,0.1),-5px_-5px_20px_rgba(255,255,255,0.8)]">
        
        {/* Top Nav */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1.5 cursor-pointer">
              <div className="w-8 h-[2px] bg-[#222]"></div>
              <div className="w-8 h-[2px] bg-[#222]"></div>
              <div className="w-8 h-[2px] bg-[#222]"></div>
            </div>
            <h1 className="text-4xl leading-none tracking-tight font-bold">Exodia Enterprise</h1>
          </div>
          
          <div className="flex items-center gap-8 text-sm font-bold opacity-80">
            <span>REGION: US-EAST-1</span>
            <span>UPTIME: 99.99%</span>
            <span>14:41</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex flex-1 gap-6">
          
          {/* Left Column (35%) */}
          <div className="w-[35%] flex flex-col gap-6">
            
            {/* Thermostat Card */}
            <div className="border-[1.5px] border-[#222] rounded-[2rem] p-6 flex flex-col justify-between h-[250px]">
              <div className="flex justify-between items-start">
                <div className="text-xs uppercase tracking-widest font-bold opacity-80">OVERALL AI CONFIDENCE</div>
                <div className="border-[2.5px] border-[#222] rounded-full p-1">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold bg-[#E6E8DB] border-4 border-[#222]">
                    68%
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-bold opacity-80 mb-2">Analyzing Kafka streams...</div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border-[1.5px] border-[#222] flex items-center justify-center cursor-pointer">
                    <div className="w-4 h-[2px] bg-[#222]"></div>
                  </div>
                  <div className="text-5xl tracking-tighter leading-none font-bold">87.4%</div>
                  <div className="w-10 h-10 rounded-full border-[1.5px] border-[#222] flex items-center justify-center cursor-pointer relative">
                    <div className="w-4 h-[2px] bg-[#222] absolute"></div>
                    <div className="h-4 w-[2px] bg-[#222] absolute"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kafka Card */}
            <div className="border-[1.5px] border-[#222] rounded-[2rem] p-6 flex flex-col relative flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="text-xs uppercase tracking-widest font-bold opacity-80">KAFKA CLUSTER</div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-widest font-bold opacity-80">INGEST RATE</div>
                  <div className="text-2xl font-bold">1,204 MB/s</div>
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-auto">
                <div className="flex gap-1 h-20 mt-auto">
                  {[1,2,3,4,5,6,7,8,9].map(i => (
                    <div key={i} className="w-2 h-full border-[1.5px] border-[#222] rounded-full"></div>
                  ))}
                </div>
                
                <div className="text-right">
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-widest font-bold opacity-80">NETWORK LAG</div>
                    <div className="text-xl font-bold">1.7ms</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest font-bold opacity-80">FLINK FILTER</div>
                    <div className="text-xl tracking-wide font-bold">ON <span className="opacity-30">OFF</span></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (65%) */}
          <div className="w-[65%] flex flex-col gap-6">
            
            {/* Top Row of Right Col */}
            <div className="flex gap-6 h-[250px]">
              {/* Agents Card */}
              <div className="flex-1 border-[1.5px] border-[#222] rounded-[2rem] p-6 flex flex-col relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs uppercase tracking-widest font-bold opacity-80">LANGGRAPH AGENTS</div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-widest font-bold opacity-80">THREATS PROCESSED</div>
                    <div className="text-2xl font-bold">320k</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-auto">
                  <div>
                    <div className="text-right">
                      <div className="mb-4 text-left">
                        <div className="text-xs uppercase tracking-widest font-bold opacity-80">WEEKLY TREND</div>
                        <div className="text-xl font-bold">+1.6%</div>
                      </div>
                      <div className="text-left">
                        <div className="text-xs uppercase tracking-widest font-bold opacity-80">TOTAL BLOCKED</div>
                        <div className="text-xl font-bold">190k</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Qdrant / Airflow Card */}
              <div className="flex-1 border-[1.5px] border-[#222] rounded-[2rem] p-6 flex flex-col relative bg-[#222] text-[#E6E8DB]">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs uppercase tracking-widest font-bold opacity-80">QDRANT VECTOR DB</div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-widest font-bold opacity-80">VECTORS</div>
                    <div className="text-2xl font-bold">8.4M</div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-widest font-bold opacity-80">LAST AIRFLOW SYNC</div>
                    <div className="text-xl font-bold">03:00 AM</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest font-bold opacity-80">INTEL SOURCES</div>
                    <div className="text-lg tracking-wide font-bold">NVD, MITRE, MISP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row (Rules Table) */}
            <div className="flex-1 border-[1.5px] border-[#222] rounded-[2rem] p-6 flex flex-col">
              <div className="flex justify-between items-end mb-4">
                <div className="text-2xl font-bold tracking-tight">Active Guardrail Rules</div>
                <div className="text-xs font-bold cursor-pointer border-[1.5px] border-[#222] px-4 py-2 rounded-full hover:bg-[#222] hover:text-[#E6E8DB] transition-colors">+ ADD NEW RULE</div>
              </div>
              
              <div className="border-b-[1px] border-[#222] opacity-20 mb-2"></div>

              {/* Table Header */}
              <div className="flex items-center py-2 text-[0.7rem] font-bold opacity-60 uppercase tracking-widest px-2">
                <div className="w-[180px]">Threat Vector</div>
                <div className="w-[100px]">Confidence</div>
                <div className="flex-[1.5]">Routing Action</div>
                <div className="flex-[1.5]">SOAR Playbook</div>
                <div className="w-[80px] text-right">Auto-Block</div>
              </div>
              <div className="border-b-[1px] border-[#222] opacity-20"></div>

              <div className="overflow-y-auto pr-2">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center py-4 border-b-[1px] border-[rgba(34,34,34,0.1)] text-sm font-bold px-2 hover:bg-[rgba(0,0,0,0.03)] rounded-lg transition-colors">
                    <div className="w-[180px] tracking-tight uppercase">{rule.vector}</div>
                    <div className="w-[100px]">{rule.confidence}</div>
                    <div className="flex-[1.5] opacity-80 uppercase text-xs">{rule.action}</div>
                    <div className={`flex-[1.5] uppercase text-xs ${rule.action === 'HUMAN-IN-THE-LOOP' ? 'text-red-700 font-extrabold' : 'opacity-80'}`}>
                      {rule.playbook}
                    </div>
                    <div className="w-[80px] flex justify-end">
                      <div 
                        onClick={() => toggleRule(rule.id)}
                        className={`w-14 h-7 border-[2px] border-[#222] rounded-full relative flex items-center p-0.5 cursor-pointer ${rule.enabled ? 'bg-[#222]' : 'bg-transparent'}`}
                      >
                        <span className={`text-[0.6rem] absolute font-bold ${rule.enabled ? 'text-[#E6E8DB] left-2' : 'text-[#222] right-2'}`}>
                          {rule.enabled ? 'ON' : 'OFF'}
                        </span>
                        <div className={`w-5 h-5 rounded-full transition-transform ${rule.enabled ? 'bg-[#E6E8DB] translate-x-7' : 'bg-[#222] translate-x-0'}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
