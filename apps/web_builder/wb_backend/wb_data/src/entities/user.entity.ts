import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany,
 } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserRole } from './role.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column({ name: 'password_hash' })
  password_hash!: string;

  @OneToMany(() => ProjectEntity, (project) => project.owner)
  projects!: ProjectEntity[];

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({
    type: "datetime",
    default: null,
    nullable: true,
  })
  deletedAt!: Date | null;

}
