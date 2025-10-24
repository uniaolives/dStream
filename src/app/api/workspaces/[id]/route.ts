// src/app/api/workspaces/[id]/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: { agents: true, tasks: true },
  })
  if (!workspace) {
    return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
  }
  return NextResponse.json(workspace)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { name, description } = await request.json()
  const updatedWorkspace = await prisma.workspace.update({
    where: { id: params.id },
    data: {
      name,
      description,
    },
  })
  return NextResponse.json(updatedWorkspace)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.workspace.delete({
    where: { id: params.id },
  })
  return new Response(null, { status: 204 })
}
