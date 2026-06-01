import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

const PORT = Number(process.env.PORT ?? 3001)
const WEB_ORIGIN = process.env.WEB_ORIGIN ?? 'http://localhost:3000'

const app = new Elysia()
  .use(cors({ origin: [WEB_ORIGIN] }))
  .get('/health', () => ({
    status: 'ok' as const,
    service: 'api',
  }))
  .listen(PORT, ({ hostname, port }) => {
    console.log(`api listening on ${hostname}:${port}`)
  })

export type App = typeof app
