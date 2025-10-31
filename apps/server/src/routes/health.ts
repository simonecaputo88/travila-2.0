import { FastifyPluginCallback } from 'fastify';
const plugin: FastifyPluginCallback = (app, _opts, done) => {
  app.get('/health', async () => ({ ok: true }));
  done();
};
export default plugin;
