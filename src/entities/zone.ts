import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Zone {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}