import { Server, Socket } from 'socket.io';

import { Presentation, Question, Vote } from './presentation';
import { PresentationManager, Message, Reply } from './presentationManager';

export class Room {
  private roomId: string;
  private server: Server;
  private presentationManager: PresentationManager;
  private target2room;

  constructor(server: Server, presentation: Presentation) {
    this.server = server;
    this.presentationManager = new PresentationManager(presentation);
    this.roomId = 'r-' + Date.now();

    this.target2room = {
      all: this.roomId,
      host: this.roomId + 'h',
      guest: this.roomId + 'g',
    };
  }

  join(userType: string, socket: Socket) {
    // add to socket group
    socket.join(this.target2room['all']);
    socket.join(this.target2room[userType]);

    // registaer event handler
    socket.on('message', (msg) => {
      let message: Message = msg as Message;
      let replies = this.presentationManager.handle(message);
      console.log(replies);
      for (const reply of replies) {
        this._sendReply(socket, reply);
      }
    });

    socket.emit('joined');
  }

  private _sendReply(socket: Socket, reply: Reply) {
    if (reply.target === 'sender') {
      socket.emit(reply.type, reply.content);
    } else {
      this.server
        .to(this.target2room[reply.target])
        .emit(reply.type, reply.content);
    }
  }
}
