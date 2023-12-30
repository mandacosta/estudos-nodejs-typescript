import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  test,
} from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Transaction Routes', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    // Desta forma, antes de cada teste serão executados os métodos UP e DOWN das migrations
    // Entra no mundo ideal de ter tudo zerado antes de cada teste para evitar conflitos
    // Cada caso é um caso e é importante pensar no tempo que pode levar o teste
    // Caso seja necessário também é possível criar e destruir apenas uma vez usando o beforeAll e afterAll
    execSync('npm run knex migrate:rollback --all') // Destrói as tabelas
    execSync('npm run knex migrate:latest') // Cria as tabelas
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Pix para o pai',
        amount: 12.55,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    // Nunca devemos usar a resposta de um teste em outro
    // Se eu preciso de um dado gerado pela aplicação em um teste
    // eu preciso gerar esse dado novamente e não usar a rota que testa a geração desse dado
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Pix para o pai',
        amount: 12.55,
        type: 'debit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')
    const sessionId = cookies[0].split(';')[0].split('=')[1]

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Pix para o pai',
        amount: -12.55,
        session_id: sessionId,
      }),
    ])
  })

  it('should be able to get a transaction by id', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Pix para o pai',
        amount: 12.55,
        type: 'debit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const transactionList = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = transactionList.body.transactions[0].id

    const transaction = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(transaction.body).toEqual(
      expect.objectContaining({
        title: 'Pix para o pai',
        amount: -12.55,
        id: transactionId,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createDebitTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Pix para o pai',
        amount: 10,
        type: 'debit',
      })
      .expect(201)

    const cookies = createDebitTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Pix da Vó',
        amount: 30,
        type: 'credit',
      })
      .expect(201)

    const summary = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summary.body).toEqual(
      expect.objectContaining({
        summary: {
          amount: 20,
        },
      }),
    )
  })
})
