/**
 * Description: TypeORM schema for gamer base entity
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

export enum Roles {
  Gamer,
  Admin,
}

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text', nullable: false })
  public name: string;

  @Column({ type: 'text', nullable: false, select: false })
  public password: string;

  @Column({ type: 'int', nullable: false, enum: Roles, default: Roles.Gamer })
  public role: Roles.Admin | Roles.Gamer;

  @Column({ type: 'decimal', nullable: false, default: 1 })
  public rating: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  protected createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  protected updatedAt: Date;
}
