import { Message } from "./index";

interface SubscribeChannel {
  op: 'subscribeChannel';
  data: {
    channelId: string;
  };
}

interface Authenticate {
  op: 'authenticate';
  data: {
    token: string;
  };
}

interface Ready {
  op: 'ready';
  data: {};
}

interface ErrorEvent {
  op: 'error';
  data: {
    code: string;
  };
}

interface MessageCreated {
  op: 'messageCreated';
  data: Message;
}

interface UnknownOperation {
  op: '___';
  data: unknown;
}

export type Commands = UnknownOperation
  | Authenticate
  | SubscribeChannel;

export type Events = UnknownOperation
  | Ready
  | ErrorEvent
  | MessageCreated;

export type PickCommandData<K> = Extract<Commands, { op: K }>['data'];
export type PickEventData<K> = Extract<Events, { op: K }>['data'];
