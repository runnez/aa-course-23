import { Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm'

@Entity()
export class Task extends BaseEntity {
  @PrimaryColumn()
  id: number

  @Column()
  description: string

  @Column()
  fee: number

  @Column()
  reward: number
}