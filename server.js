const express = require("express");
const cors = require("cors");
const helemt = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { router} = require("./routes/index")
const Port = 8080;

const server = express();
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
