import WebSocket from "ws";
import {RoomEngine} from "./roomEngine";
import {Container} from "typedi";
import {v4} from "uuid";
import {Commands, Events, PickCommandData, PickEventData} from "../models/operations";
import jwt from 'jsonwebtoken';
import { ClientStorage } from "./clientStorage";

const roomEngine = Container.get(RoomEngine);

const ops: Partial<{ [K in Commands['op']]: (socket: Client, msg: PickCommandData<K>) => void }> = {
  authenticate: async (client, { token }) => {
    try {
      const obj = jwt.verify(token, 'secret');
      console.log(obj);
      client.send('ready', {})
    } catch (e) {
      console.log(e);
    }
  },
  subscribeChannel: (client, data) => {
    roomEngine.joinRoom(client, data.channelId);
    console.log(`joined channel ${data.channelId}`);
  },
}

export class Client {
  public readonly id: string;
  public readonly rooms: Set<string> = new Set();
  private readonly socket: WebSocket;

  public readonly storage: ClientStorage;

  constructor(socket: WebSocket) {
    this.storage = new ClientStorage();
    this.id = v4();
    this.socket = socket;
  }
  onMessage(msg: Commands) {
    (ops as any)[msg.op](this, msg.data);
  }

  send<T extends Events['op']>(op: T, data: PickEventData<T>) {
    this.socket.send(JSON.stringify({ op, data }));
  }

  sendMessage(msg: any) {
    this.socket.send(JSON.stringify(msg));
  }
}

export function setupWebsocket(wss: WebSocket.Server) {
  wss.on('connection', (socket) => {
    const client = new Client(socket);
    roomEngine.addClient(client);

    socket.on('message', msg => {
      // console.log(msg)
      if (typeof msg === 'string') {
        client.onMessage(JSON.parse(msg));
      }
    });
    socket.on('close', () => {
      console.log('disconnected');
      roomEngine.removeClient(client);
    })
  });
}