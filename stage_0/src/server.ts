import app from './app.js';
import http from 'http';
import { BoardGateway } from './gateways/board.gateway.js';
import { logger } from './config/logger.js';
import prisma from './config/database.js';
const PORT = process.env.PORT || 1000;
const server = http.createServer(app);
new BoardGateway(server);

server.listen(PORT, () => {
  logger.info(`Welcome!, listening on port ${PORT}`);
  logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Closing server gracefully...`);

  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Database disconnected. Exiting process.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forcing shutdown due to timeout');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
