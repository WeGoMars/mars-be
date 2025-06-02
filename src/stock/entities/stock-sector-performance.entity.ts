import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity()
@Unique('UQ_SECTOR_PERFORMANCE', ['date', 'sector'])
@Index('IDX_SECTOR_PERFORMANCE', ['date', 'sector'])
export class SectorPerformance {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column()
  sector: string; // 예: 'Technology', 'Healthcare', 'Utilities' 등

  @Column('float')
  return: number; // 해당 일자의 수익률 (% 단위로 저장)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
