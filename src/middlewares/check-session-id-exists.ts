// Incorporar no segundo parametro da rota dentro de um objeto com a chave preHandlers que é um array
// Ir checando em todas as rotas se ta enviando apenas os dados referentes ao session id

import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
}
