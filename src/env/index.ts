import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'test', 'development']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3000),
})

export const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('⚠️ Invalid enviroment variables !!', _env.error.format())
  throw new Error('⚠️ Invalid enviroment variables !!')
}

export const env = _env.data
