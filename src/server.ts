import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import helemt from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createClient } from 'redis';
import { DbHealthCheck } from './db/health.db';
import router from './routes/index';
const Port = 8080;

dotenv.config();

const { urlRedisCloud, password } = process.env;

(async () => {
  const client = createClient({
    url: `redis://${urlRedisCloud}`,
    password,
  });

  client.on('error', (err) => console.log('Redis Client Error', err));
  client.on('connect', () => console.log('Redis Client Connected'));

  await client.connect();

  await client.set('key', 'value');
  const value = await client.get('key');
})();

const server: Express = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(compression());
server.use(cors());
server.use(helemt());
server.use(morgan('tiny'));
server.use(router);

DbHealthCheck();

server.listen(Port, () => console.log(`Server is starting cleanup at: http://localhost:${Port}`));
