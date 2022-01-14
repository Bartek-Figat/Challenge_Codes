/* eslint-disable no-undef */
import dotenv from 'dotenv';
import { Database } from '../db/index'
import { dbOptionsType } from '../types/types'

dotenv.config();

export const dbOptions: dbOptionsType = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

interface ProcessEnv {
    [key: string]: string
}

const { dbURI } = process.env as ProcessEnv

export class UserRepository {
    static db = Database

    static async insertOne(doc: any) {
        const { collection, client } = await this.db.connect(dbURI, dbOptions)
        try {
            return await collection.insertOne(doc)
        } catch (e) {
            console.log(e)
        } finally {
            await client.close()
        }
    }

    static async insertMany(doc: any, options: any) {
        const { collection, client } = await this.db.connect(dbURI, dbOptions)
        try {
            return await collection.insertMany(doc, options)
        } catch (e) {
            console.log(e)
        } finally {
            await client.close()
        }
    }

    static async findOne(query: any, options: {}) {
        const { collection, client } = await this.db.connect(dbURI, dbOptions)
        try {
            return await collection.findOne(query, options)
        } catch (e) {
            console.log(e)
        } finally {
            await client.close()
        }
    }

    static async find(query: any, options: any) {
        const { collection, client } = await this.db.connect(dbURI, dbOptions)
        try {
            return await collection.find(query, options).toArray()
        } catch (e) {
            console.log(e)
        } finally {
            await client.close()
        }
    }

    static async updateMany(filter: any, update: any, options: any) {
        const { collection, client } = await this.db.connect(dbURI, dbOptions)
        try {
            return await collection.updateMany(filter, update, options)
        } catch (e) {
            console.log(e)
        } finally {
            await client.close()
        }
    }

    static async updateOne(filter: any, update: any, options: any) {
        const { collection, client } = await this.db.connect(dbURI, dbOptions)
        try {
            return await collection.updateOne(filter, update, options)
        } catch (e) {
            console.log(e)
        } finally {
            await client.close()
        }
    }

    static async findOneAndUpdate(filter: any, updateDoc: any) {
        const { collection, client } = await this.db.connect(dbURI, dbOptions)
        try {
            return await collection.findOneAndUpdate(filter, updateDoc)
        } catch (e) {
            console.log(e)
        } finally {
            await client.close()
        }
    }

    static async deleteOne(filter: any, options: any) {
        const { collection, client } = await this.db.connect(dbURI, dbOptions)
        try {
            return await collection.deleteOne(filter, options)
        } catch (e) {
            console.log(e)
        } finally {
            await client.close()
        }
    }

    static async deleteMany(filter: any, options: any) {
        const { collection, client } = await this.db.connect(dbURI, dbOptions)
        try {
            return await collection.deleteMany(filter, options)
        } catch (e) {
            console.log(e)
        } finally {
            await client.close()
        }
    }
}
