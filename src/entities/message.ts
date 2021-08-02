import {Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {User} from "./user";
import {Channel} from "./channel";
import {v4} from "uuid";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  content: string;

  @Index()
  @RelationId((x: Message) => x.author)
  @Column()
  authorId: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author!: User;

  @Index()
  @RelationId((x: Message) => x.channel)
  @Column()
  channelId: string;
  @ManyToOne(() => Channel, { onDelete: 'CASCADE' })
  channel!: Channel;

  @CreateDateColumn()
  @Index()
  createdAt!: Date;

  constructor(channelId: string, authorId: string, content: string) {
    this.id = v4()
    this.channelId = channelId;
    this.authorId = authorId;
    this.content = content
    this.createdAt = new Date();
  }
}