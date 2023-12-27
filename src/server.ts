import fastify from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'

const app = fastify()

app.get('/', async () => {
  const transaction = await knex('transactions').select('*')

  return transaction
})

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('HTTP Server running on Port 3000!')
  })
