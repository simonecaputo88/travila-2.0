import { FastifyPluginCallback } from 'fastify';
const plugin: FastifyPluginCallback = (app, _opts, done) => {
  app.post('/flights/search', async () => ({ options: [] }));
  done();
};
export default plugin;
