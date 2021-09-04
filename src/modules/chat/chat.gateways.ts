import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from '@nestjs/platform-socket.io/node_modules/socket.io';
import { UsersService } from '../users/services/users.service';
import { MessageService } from './services/message.service';
import { RoomService } from './services/room.service';

@WebSocketGateway()
export class MainGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  async handleConnection(client) {
    client.emit('connected', { ns: [] });
  }
}

@WebSocketGateway(3002, { namespace: 'music' })
export class MusicGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
  ) {}

  @SubscribeMessage('join')
  async handleJoiningRoom(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const decode = await this.jwtService.decode(
      client.handshake.query.token as string,
    );

    const userId = decode ? decode['id'] : '';

    const user = await this.userService.findOne({ id: userId });

    // leave old
    const iter = client.rooms.values();
    // iter.next();
    const second = iter.next().value;
    let secondName = '';
    if (+second > 0) {
      const secondRoom = await this.roomService.findOne({ id: second });
      if (secondRoom) secondName = secondRoom.name;
    }
    if (second !== data) {
      client.leave(second);
      this.server.to(`${second}`).emit('left', {
        message: `${user?.username} has left ${secondName}`,
      });
    }

    // join new room
    client.join(`${data}`);

    // send to all client in this room that someone is joined.
    const newRoom = await this.roomService.findOne({ id: `${data}` });
    this.server.to(`${data}`).emit('joined', {
      message: `${user?.username} has joined ${newRoom?.name}`,
    });

    return `${data}`;
  }

  @SubscribeMessage('client_send_message')
  async handleClientSendMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const decode = await this.jwtService.decode(
      client.handshake.query.token as string,
    );

    const userId = decode ? decode['id'] : '';

    const user = await this.userService.findOne({ id: userId });

    if (!user) return;

    const message = await this.messageService.createMessage(
      user,
      data.roomId,
      data.message,
    );

    this.server.to(`${data.roomId}`).emit('message_from_room', {
      message: message,
      user: {
        id: user?.id,
        username: user?.username,
        avatar: user?.avatar,
      },
    });
  }
}

@WebSocketGateway(3002, { namespace: 'tech' })
export class TechGateway {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  async handleJoiningRoom(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const decode = await this.jwtService.decode(
      client.handshake.query.token as string,
    );

    const userId = decode ? decode['id'] : '';

    const user = await this.userService.findOne({ id: userId });

    // leave old
    const iter = client.rooms.values();
    // iter.next();
    const second = iter.next().value;
    let secondName = '';
    if (+second > 0) {
      const secondRoom = await this.roomService.findOne({ id: second });
      if (secondRoom) secondName = secondRoom.name;
    }
    if (second !== data) {
      client.leave(second);
      this.server.to(`${second}`).emit('left', {
        message: `${user?.username} has left ${secondName}`,
      });
    }

    // join new room
    client.join(`${data}`);

    // send to all client in this room that someone is joined.
    const newRoom = await this.roomService.findOne({ id: `${data}` });
    this.server.to(`${data}`).emit('joined', {
      message: `${user?.username} has joined ${newRoom?.name}`,
    });

    return `${data}`;
  }

  @SubscribeMessage('client_send_message')
  async handleClientSendMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const decode = await this.jwtService.decode(
      client.handshake.query.token as string,
    );

    const userId = decode ? decode['id'] : '';

    const user = await this.userService.findOne({ id: userId });

    if (!user) return;

    const message = await this.messageService.createMessage(
      user,
      data.roomId,
      data.message,
    );

    this.server.to(`${data.roomId}`).emit('message_from_room', {
      message: message,
      user: {
        id: user?.id,
        username: user?.username,
        avatar: user?.avatar,
      },
    });
  }
}
