// src/app/api/tasks/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const tasks = await prisma.task.findMany()
  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const { title, description, priority, workspaceId, agentId } = await request.json()
  const newTask = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      workspaceId,
      agentId,
    },
  })
  return NextResponse.json(newTask, { status: 201 })
}
