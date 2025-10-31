import { FastifyPluginCallback } from 'fastify';
const plugin: FastifyPluginCallback = (app, _opts, done) => {
  app.post('/guides', async () => ({ content: 'TODO: Smart Guide' }));
  done();
};
export default plugin;
