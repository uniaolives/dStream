// src/app/api/agents/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const agents = await prisma.agent.findMany()
  return NextResponse.json(agents)
}

export async function POST(request: Request) {
  const { name, specialty, capabilities } = await request.json()
  const newAgent = await prisma.agent.create({
    data: {
      name,
      specialty,
      capabilities,
    },
  })
  return NextResponse.json(newAgent, { status: 201 })
}
