import { Entity, Column, PrimaryColumn, BaseEntity, OneToMany } from 'typeorm'
import { Transaction } from './transaction.model';

@Entity()
export class Account extends BaseEntity {
  @PrimaryColumn()
  id: number

  @Column()
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[]
}