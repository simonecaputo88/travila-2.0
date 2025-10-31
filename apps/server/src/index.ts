import Fastify from 'fastify';
import cors from '@fastify/cors';
import { connect } from './db';
import { env } from './env';
import health from './routes/health';
import auth from './routes/auth';
import itineraries from './routes/itineraries';
import guides from './routes/guides';
import flights from './routes/flights';

const app = Fastify({ logger: true });
await app.register(cors, { origin: env.CORS_ORIGIN.split(',') });
app.register(health, { prefix: '/api' });
app.register(auth, { prefix: '/api' });
app.register(itineraries, { prefix: '/api' });
app.register(guides, { prefix: '/api' });
app.register(flights, { prefix: '/api' });

await connect();
app.listen({ port: env.PORT, host: '0.0.0.0' });
