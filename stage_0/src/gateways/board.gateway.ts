import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { appEvents, EVENTS } from '../common/events/event-emitter.js';
import {
  AuthenticatedSocket,
  socketAuthMiddleware,
} from '../common/middleware/socket_auth.middleware.js';

export class BoardGateway {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.init();
  }
  private init() {
    this.io.use(socketAuthMiddleware);
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`Client conected: ${socket.user?.email}`);

      socket.on('join_board', (boardId: string) => {
        const roomName = `board_${boardId}`;
        socket.join(roomName);
        console.log(`User ${socket.user?.email} joined the ${roomName}`);
      });
      socket.on('leave_board', (boardId: string) => {
        const roomName = `board_${boardId}`;
        socket.leave(roomName);
        console.log(`User ${socket.user?.email} left the ${roomName}`);
      });
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    appEvents.on(
      EVENTS.CARD_CREATED,
      (payload: { boardId: string; card: any }) => {
        this.io.emit('card:created', payload);
      }
    );

    appEvents.on(
      EVENTS.CARD_MOVED,
      (payload: { boardId: string; card: any }) => {
        this.io.emit('card:moved', payload);
      }
    );

    appEvents.on(
      EVENTS.COMMENT_ADDED,
      (payload: { boardId: string; card: any }) => {
        this.io.emit('comment:added', payload);
      }
    );
  }
}
