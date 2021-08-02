import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}