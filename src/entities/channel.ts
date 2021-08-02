import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {Zone} from "./zone";

@Entity()
export class Channel {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name: string;

  @Index()
  @RelationId((x: Channel) => x.zone)
  @Column()
  zoneId: string;
  @ManyToOne(() => Zone, { onDelete: 'CASCADE' })
  zone!: Zone;

  constructor(zoneId: string, name: string) {
    this.zoneId = zoneId;
    this.name = name
  }
}