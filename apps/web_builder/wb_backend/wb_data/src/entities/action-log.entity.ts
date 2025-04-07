import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'action_logs' })
export class ActionLogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  action!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
