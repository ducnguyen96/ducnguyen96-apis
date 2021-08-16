import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MainGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  async handleConnection(client) {
    client.emit('connected', { ns: [] });
  }
}

@WebSocketGateway(3002, { namespace: 'music' })
export class MusicGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  async handleConnection(client) {
    client.emit('connected', { ns: ['music', 'tech'] });
  }
}

@WebSocketGateway(3003, { namespace: 'tech' })
export class TechGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  async handleConnection(client) {
    client.emit('connected', { ns: ['music', 'tech'] });
  }
}
