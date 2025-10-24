// src/app/api/workspaces/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const workspaces = await prisma.workspace.findMany()
  return NextResponse.json(workspaces)
}

export async function POST(request: Request) {
  const { name, description } = await request.json()
  const newWorkspace = await prisma.workspace.create({
    data: {
      name,
      description,
    },
  })
  return NextResponse.json(newWorkspace, { status: 201 })
}
