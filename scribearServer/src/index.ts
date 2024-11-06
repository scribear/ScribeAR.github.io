import dotenv from 'dotenv';
import createLogger from './logger';
import Fastify from 'fastify';
import FastifyWebsocket from '@fastify/websocket';
import createWebsocketHandler from './websocketHandler';

// Grab configuration from .env file
dotenv.config();

const log = createLogger();

const fastify = Fastify({loggerInstance: log});
fastify.register(FastifyWebsocket);
fastify.register(createWebsocketHandler(log));

fastify.listen(
  {port: process.env.PORT ? parseInt(process.env.PORT) : 8080},
  err => {
    if (err) {
      fastify.log.fatal(err);
      throw err;
    }
  }
);
