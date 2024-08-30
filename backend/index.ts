import express from 'express';
import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';

import { Server, Socket } from 'socket.io';

const app = express();

app.use(bodyParser.json());
app.use(cors());
const server = http.createServer(app);
// prepare sock with cors
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vue.js アプリケーションのURL
    methods: ['GET', 'POST'],
  },
});

// static rooting
app.use(
  '/resource/anim',
  express.static(path.join(__dirname, '/resource/anim'))
);
app.use('/', express.static(path.join(__dirname, '../frontend/dist/')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

import {
  Presentation,
  Slide,
  Vote,
  Question,
  Option,
  OptionQuestion,
} from './src/presentation';

import { Room } from './src/room';
import { DogAnimator } from './src/animator';

let presentation: Presentation = new Presentation(
  [
    new OptionQuestion(
      'あなたの所属を教えてください',
      2,
      [
        { label: '理系', value: 1, color: 'red' },
        { label: '文系', value: 2, color: 'red' },
        { label: '情報系', value: 3, color: 'red' },
      ] as Option[],
      { message: 'thanks' }
    ),
    new OptionQuestion(
      'Test2',
      50,
      [
        { label: 'optionA', value: 1, color: 'blue' },
        { label: 'optionB', value: 2, color: 'blue' },
        { label: 'optionC', value: 3, color: 'blue' },
      ] as Option[],
      { message: 'thanks2' }
    ),
  ],
  new DogAnimator()
);

const room = new Room(io, presentation);

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  // クライアントからのメッセージを受け取る
  socket.on('join', (msg) => {
    console.log('message: ' + msg.user);
    // メッセージを全クライアントにブロードキャスト
    room.join(msg.user, socket);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Server is running at :' + PORT);
});
