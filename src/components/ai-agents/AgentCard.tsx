// src/components/ai-agents/AgentCard.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AgentCardProps {
  agent: {
    id: string
    name: string
    specialty: string
    capabilities: string
    status: string
  }
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
        <CardDescription>{agent.specialty}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.split(',').map((capability) => (
            <Badge key={capability} variant="secondary">{capability.trim()}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Badge variant={agent.status === 'online' ? 'default' : 'destructive'}>
          {agent.status}
        </Badge>
      </CardFooter>
    </Card>
  )
}
