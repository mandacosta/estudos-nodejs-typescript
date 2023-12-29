// arquivos d.ts são para definição de tipos !
// o @ é apenas para que a pasta fique no tipo da lista
// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      amount: number
      title: string
      created_at: string
      session_id?: string
    }
  }
}
