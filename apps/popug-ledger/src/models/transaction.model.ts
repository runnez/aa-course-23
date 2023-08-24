import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Account } from './account.model';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  amount: number;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn()
  account: Account;

  @Column()
  accountId: number

  @Column()
  description: string;

  @Column()
  taskId: number
}