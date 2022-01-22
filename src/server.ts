import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import helemt from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import process from 'process';
import { DbHealthCheck } from './db/health.db';
import router from './routes/index';
const Port = 8080;

dotenv.config();

process.on('SIGINT', (err) => {
  process.exit(0);
});
const server: Express = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(compression());
server.use(cors());
server.use(helemt());
server.use(morgan('tiny'));
server.use(router);
server.enable('trust proxy');

DbHealthCheck();

server.listen(Port, () => console.log(`Server is starting cleanup at: http://localhost:${Port}`));
