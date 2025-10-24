// src/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { AgentCard } from '@/components/ai-agents/AgentCard'
import { CreateAgentDialog } from '@/components/ai-agents/CreateAgentDialog'

interface Agent {
  id: string
  name: string
  specialty: string
  capabilities: string
  status: string
}

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([])

  async function fetchAgents() {
    const response = await fetch('/api/agents')
    const data = await response.json()
    setAgents(data)
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <CreateAgentDialog onAgentCreated={fetchAgents} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  )
}
