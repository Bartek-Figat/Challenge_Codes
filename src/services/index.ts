import { Request, Response, NextFunction, RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import { ObjectId } from 'mongodb'
import { UserRepository } from '../repositories/index'
import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { StatusCode } from '../utils/index'
const saltRounds = 10

export const registerUser: RequestHandler = async (
    req,
    res,
    next
): Promise<Response> => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res
                .status(StatusCode.BAD_REQUEST)
                .json({ errors: errors.array() })
        }
        const { email, password } = req.body as {
            email: string
            password: string
        }
        const emailValid = await UserRepository.findOne({ email }, {})
        if (emailValid)
            return res
                .status(StatusCode.BAD_REQUEST)
                .json({ status: `${StatusCode.BAD_REQUEST}` })

        const isValidPassword = await hash(password, saltRounds)
        const user = {
            email,
            isValidPassword,
        }
        await UserRepository.insertOne(user)
        return res
            .status(StatusCode.SUCCESS)
            .json({ status: `${StatusCode.SUCCESS}` })
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` })
    }
}

export const loginUser: RequestHandler = async (
    req,
    res,
    next
): Promise<Response> => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res
                .status(StatusCode.BAD_REQUEST)
                .json({ errors: errors.array() })
        }
        const { email, password } = req.body as {
            email: string
            password: string
        }
        const user = await UserRepository.findOne({ email }, {})
        const match = user && (await compare(password, user.isValidPassword))

        if (!match)
            return res
                .status(StatusCode.NOT_FOUND)
                .json({ status: `${StatusCode.NOT_FOUND}` })
        const generateAccessToken = sign(
            { generateAccessToken: user._id },
            `secret`
        )
        return res.json({ generateAccessToken })
    } catch (err) {
        console.log(err)
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` })
    }
}

export const userResources: RequestHandler = async (
    req,
    res,
    next
): Promise<Response> => {
    try {
        const { generateAccessToken } = req.user as {
            generateAccessToken: string
        };
        const query = { _id: new ObjectId(generateAccessToken) };
        const options = { projection: { isValidPassword: 0 } };
        const user = await UserRepository.findOne(query, options);
        return res.format({'application/json': () => {res.send({ user })}});
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .format({'application/json': () => {res.send({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` })}});
    }
}

export const saveChanges: RequestHandler = async (
    req,
    res,
    next
): Promise<Response> => {
    try {
        const { email } = req.body as { email: string }
        const { generateAccessToken } = req.user as {
            generateAccessToken: string
        }
        const filter = { _id: new ObjectId(generateAccessToken) }
        const options = { upsert: true }
        const updateDoc = {
            $set: {
                email,
            },
        }
        await UserRepository.updateOne(filter, updateDoc, options)
        return res
        .status(StatusCode.SUCCESS)
        .format({'application/json': () => { res.send({status: `${StatusCode.SUCCESS}` })}});
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` })
    }
}

export const deleteToken: RequestHandler = async (
    req,
    res,
    next
): Promise<Response> => {
    try {
        return res
            .status(StatusCode.SUCCESS)
            .json({ status: `${StatusCode.SUCCESS}` })
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` })
    }
}
