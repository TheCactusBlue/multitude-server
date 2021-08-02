import {Body, CurrentUser, Get, JsonController, Param, Post} from "routing-controllers";
import {Service} from "typedi";

import * as i from "../models";
import { Channel, Message } from '../entities';
import {RoomEngine} from "../sockets/roomEngine";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import {UserToken} from "./UserToken";

interface MessagePayload {
  content: string;
}

@JsonController('/channel')
@Service()
export class ChannelController {
  constructor(
    private roomEngine: RoomEngine,
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(Message) private messageRepo: Repository<Message>
  ) {
  }

  @Get('/')
  async listChannels() {
    const res = await this.channelRepo.find({});
    return res.map(x => ({
      id: x.id,
      name: x.name
    }))
  }

  @Get('/:id/message')
  async getMessages(@Param('id') id: string): Promise<i.Message[]> {
    const res = await this.messageRepo.find({
      take: 50,
      where: { channelId: id },
      order: { createdAt: 'ASC' },
      relations: ['author']
    })

    return res.map(x => ({
      id: x.id,
      channel: x.channelId,
      timestamp: x.createdAt.getTime(),
      content: x.content,
      author: {
        id: x.author.id,
        name: x.author.name,
      }
    }));
  }

  @Post('/:id/message')
  async createMessage(@CurrentUser() user: UserToken, @Param('id') id: string, @Body() body: MessagePayload) {
    const msg = new Message(id, user.sub, body.content);
    await this.messageRepo.save(msg);

    this.roomEngine.broadcast('messageCreated', id, {
      id: msg.id,
      channel: id,
      timestamp: msg.createdAt.getTime(),
      content: msg.content,
      author: {
        id: msg.authorId,
        name: user.name,
      }
    });
    return { ok: 'ok' };
  }
}
