import express, { Express } from "express";
import cors from "cors";
import helemt from "helmet";
import compression  from "compression";
import morgan from "morgan";
const { router} = require("./routes/index")
const Port = 8080;

const server: Express = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(compression());
server.use(cors());
server.use(helemt());
server.use(morgan('tiny'));

server.use(router);

server.listen(Port, () =>
  console.log(`Server listen`, {
    message: `Server listening at: http://localhost:${Port} `,
  })
);
