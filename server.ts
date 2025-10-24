// server.ts
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })

  const io = new Server(server)

  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('agent-status', (msg) => {
      io.emit('agent-status', msg)
    })

    socket.on('task-update', (msg) => {
      io.emit('task-update', msg)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
})
