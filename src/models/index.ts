export interface Message {
  id: string;
  timestamp: number;
  content: string;
  channel: string;
  author: SimpleUser;
}

export interface SimpleUser {
  id: string;
  name: string;
}

export interface Channel {
  id: string;
  name: string;
}