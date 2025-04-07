import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from "typeorm";
import { ProjectEntity } from "./project.entity";

@Entity('page')
export class PageEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url_alias!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  metaTags?: string;

  @ManyToOne(() => ProjectEntity, (project) => project.pages)
  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @Column({ nullable: true, length: 1000 })
  thumbnail_page?: string; 

  @Column({ type: 'text', nullable: true })
  sections?: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}