import 'dotenv/config'
import { Knex, knex as setupKnex } from 'knex'

if (!process.env.DATABASE_URL) {
  throw new Error('Could not find DATABASE_URL')
}

export const config: Knex = {
  client: 'sqlite',
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
