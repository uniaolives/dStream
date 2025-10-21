import { createServer, Server as HttpServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import express from 'express';

// 1. Configuração Principal
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV!== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Lógica básica de sinalização e chat (O coração do tempo real)
const configureSocket = (io: SocketIOServer) => {
    // 2. Lógica de Sinalização WebRTC e Chat
    io.on('connection', (socket) => {
        console.log(` Novo cliente conectado: ${socket.id}`);

        // 2.1. Lógica de CHAT em tempo real
        socket.on('chatMessage', (data) => {
            console.log(`Mensagem recebida: ${data.message}`);
            // Broadcast da mensagem para todos, exceto o remetente
            socket.broadcast.emit('chatMessage', data);
        });

        // 2.2. Lógica de Sinalização WebRTC (OFERTA/RESPOSTA/ICE)
        // O cliente se junta a um 'Stream Room' para sinalização
        socket.on('joinStream', (streamId: string) => {
            socket.join(streamId);
            console.log(`${socket.id} se juntou ao stream: ${streamId}`);
            // Notifica outros pares no stream que um novo peer está pronto
            socket.to(streamId).emit('peerJoined', socket.id);
        });

        // Retransmite a Oferta SDP (negociação inicial)
        socket.on('sdpOffer', (data: { offer: any, toId: string }) => {
            // Envia a oferta apenas para o peer de destino
            socket.to(data.toId).emit('sdpOffer', { senderId: socket.id, offer: data.offer });
        });

        // Retransmite a Resposta SDP
        socket.on('sdpAnswer', (data: { answer: any, toId: string }) => {
            // Envia a resposta apenas para o peer de destino
            socket.to(data.toId).emit('sdpAnswer', { senderId: socket.id, answer: data.answer });
        });

        // Retransmite os Candidatos ICE (informações de conectividade de rede)
        socket.on('iceCandidate', (data: { candidate: any, toId: string }) => {
            // Envia o candidato ICE para o peer de destino
            socket.to(data.toId).emit('iceCandidate', { senderId: socket.id, candidate: data.candidate });
        });

        // 2.3. Desconexão
        socket.on('disconnect', () => {
            console.log(` Cliente desconectado: ${socket.id}`);
            // Lógica para remover o peer das salas e notificar os demais
        });
    });
};

// 3. Inicialização do Servidor
app.prepare().then(() => {
    const expressApp = express();
    const server: HttpServer = createServer(expressApp);

    // Configura o Socket.io no servidor HTTP
    const io = new SocketIOServer(server, {
        path: '/api/socket', // O endpoint que o cliente Socket.io deve usar
        cors: {
            origin: '*', // Ajuste para domínios de produção
            methods: ['GET', 'POST']
        }
    });

    // Anexa a lógica de sinalização ao Socket.io
    configureSocket(io);

    // 4. Roteamento Next.js: trata todas as requisições que não são Socket.io
    expressApp.use((req, res) => {
        const parsedUrl = parse(req.url!, true);
        return handle(req, res, parsedUrl);
    });

    // Inicia o servidor
    server.listen(port, (err?: any) => {
        if (err) throw err;
        console.log(`> Servidor Next.js/Socket.io pronto em http://localhost:${port}`);
    });
}).catch((ex) => {
    console.error(ex);
    process.exit(1);
});
