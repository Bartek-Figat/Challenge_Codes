import express, { Express, RequestHandler } from 'express'
import cors from 'cors'
import helemt from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { DbHealthCheck } from './db/health.db'
import router from './routes/index'
const Port = 8080

const server = express()
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(compression())
server.use(cors())
server.use(helemt())
server.use(morgan('tiny'))
server.use(router)

DbHealthCheck();

server.listen(Port, () =>
    console.log(`Server is starting cleanup at: http://localhost:${Port}`)
)
