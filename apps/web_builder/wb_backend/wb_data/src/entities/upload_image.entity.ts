import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity"; // Giả sử bạn đã có UserEntity
import { ProjectEntity } from "./project.entity"; // Giả sử bạn đã có ProjectEntity

@Entity('upload_image')  // Sửa lại tên bảng
export class UploadImageEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fileName!: string;

  @Column({
    length: 1000
  })
  filePath!: string;

  @Column()
  fileSize!: number;

  @Column()
  fileType!: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  uploadedBy!: UserEntity;

  @ManyToOne(() => ProjectEntity, { nullable: true })
  project?: ProjectEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt!: Date;
}