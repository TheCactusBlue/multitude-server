import { Client } from "./sockets";
import {Service} from "typedi";
import {Commands, Events, PickEventData} from "../models/operations";

@Service()
export class RoomEngine {
  // RoomID -> [ClientID]
  private roomClients: { [key: string]: Set<string> } = {};
  // ClientID -> (Client, [RoomID])
  private clientRooms: { [key: string]: Client } = {};

  constructor() {
    console.log('constructed once');
  }

  addClient(client: Client) {
    console.log();
    this.clientRooms[client.id] = client;
  }

  joinRoom(client: Client, room: string) {
    if (this.roomClients[room] === undefined) {
      this.roomClients[room] = new Set();
    }
    this.roomClients[room].add(client.id);
    client.rooms.add(room);
  }

  leaveRoom(client: Client, room: string) {
    client.rooms.delete(room);
    this.roomClients[room]?.delete(client.id);
    if (this.roomClients[room].size === 0) {
      delete this.roomClients[room];
    }
  }

  removeClient(client: Client) {
    if (this.clientRooms[client.id] === undefined) return;
    this.clientRooms[client.id].rooms.forEach(x => {
      delete this.roomClients[x];
    });
    delete this.clientRooms[client.id];
  }
  broadcast<T extends Events['op']>(op: T, room: string, data: PickEventData<T>) {
    const r = this.roomClients[room];
    if (r === undefined) {
      return;
    }
    r.forEach(x => this.clientRooms[x].sendMessage({
      op, data
    }));
  }
}