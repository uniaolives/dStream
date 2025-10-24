// src/app/api/agents/[id]/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const agent = await prisma.agent.findUnique({
    where: { id: params.id },
  })
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }
  return NextResponse.json(agent)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { name, specialty, capabilities, status } = await request.json()
  const updatedAgent = await prisma.agent.update({
    where: { id: params.id },
    data: {
      name,
      specialty,
      capabilities,
      status,
    },
  })
  return NextResponse.json(updatedAgent)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.agent.delete({
    where: { id: params.id },
  })
  return new Response(null, { status: 204 })
}
