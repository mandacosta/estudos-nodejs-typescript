import { afterAll, beforeAll, expect, test } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('O usuário consegue criar uma transação', async () => {
  await request(app.server)
    .post('/transactions')
    .send({
      title: 'Pix para o pai',
      amount: 12.55,
      type: 'credit',
    })
    .expect(201)
})
