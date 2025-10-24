// src/app/api/tasks/[id]/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const task = await prisma.task.findUnique({
    where: { id: params.id },
  })
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }
  return NextResponse.json(task)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { title, description, priority, status, agentId } = await request.json()
  const updatedTask = await prisma.task.update({
    where: { id: params.id },
    data: {
      title,
      description,
      priority,
      status,
      agentId,
    },
  })
  return NextResponse.json(updatedTask)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.task.delete({
    where: { id: params.id },
  })
  return new Response(null, { status: 204 })
}
