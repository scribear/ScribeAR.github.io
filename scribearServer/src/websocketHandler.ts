import {FastifyInstance} from 'fastify';

import {Logger} from './logger';
import TranscriptionEngine from './transcriptionEngine';

export default function createWebsocketHandler(log: Logger) {
  const transcription_engine = new TranscriptionEngine(log);

  function websocketHandler(fastify: FastifyInstance) {
    fastify.get('/', {websocket: true}, (ws, req) => {
      transcription_engine.registerSink(ws);
      transcription_engine.registerSource(ws);

      ws.on('close', code => {
        req.log.info({msg: 'Websocket closed', code});
      });
    });

    fastify.get('/v1/sink', {websocket: true}, (ws, req) => {
      transcription_engine.registerSink(ws);

      ws.on('message', () => {});

      ws.on('close', code => {
        req.log.info({msg: 'Websocket closed', code});
      });
    });
  }

  return websocketHandler;
}
