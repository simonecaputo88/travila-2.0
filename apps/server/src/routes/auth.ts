import { FastifyPluginCallback } from 'fastify';
const plugin: FastifyPluginCallback = (app, _opts, done) => {
  app.post('/auth/login', async () => ({ token: 'dev-token' }));
  app.post('/auth/register', async () => ({ ok: true }));
  done();
};
export default plugin;
