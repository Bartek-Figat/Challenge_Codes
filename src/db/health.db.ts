import dotenv from 'dotenv';
import { dbOptionsType } from 'src/types/types';
import { Database } from "./index";



dotenv.config()

const dbOptions: dbOptionsType = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

interface ProcessEnv {
    [key: string]: string
}

const { dbURI } = process.env as ProcessEnv




export const DbHealthCheck = async () => {
    const { client } = await Database.connect(dbURI, dbOptions)
    try {
        await client.db('admin').command({ ping: 1 });
        console.log('Connected successfully to Client DB');
    } catch (err) {
        console.log(err)
    } finally {
        client
            .close()
            .then(() => console.log('Client has disconnected'))
            .catch((err) =>
                console.error('error during disconnection', err)
            )
    }
}
