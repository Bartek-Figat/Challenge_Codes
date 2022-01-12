import { Request, Response, NextFunction} from 'express';
import { validationResult } from 'express-validator';
import { ObjectId } from 'mongodb';
import { UserRepository } from '../repositories/index';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { StatusCode } from '../utils/index';
const saltRounds = 10;

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(StatusCode.BAD_REQUEST)
                .json({ errors: errors.array() })
        }
        const { email, password } = req.body;
        const emailValid = await UserRepository.findOne({ email }, null);
        if (emailValid === null)
            return res
                .status(StatusCode.BAD_REQUEST)
                .json({ status: `${StatusCode.BAD_REQUEST}` });

        const isValidPassword = await hash(password, saltRounds);
        const user = {
            email,
            isValidPassword,
        };
        await UserRepository.insertOne(user);
        return res
            .status(StatusCode.SUCCESS)
            .json({ status: `${StatusCode.SUCCESS}` });
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` });
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res
                .status(StatusCode.BAD_REQUEST)
                .json({ errors: errors.array() })
        }
        const { email, password } = req.body;
        const user: any = await UserRepository.findOne({ email }, null);
        const match = user && (await compare(password, user.isValidPassword));

        if (!match) return res.status(StatusCode.NOT_FOUND).json({ status: `${StatusCode.NOT_FOUND}` });
        const generateAccessToken = sign(
            { generateAccessToken: user._id },
            `secret`
        );
        return res.json({ generateAccessToken });
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` });
    }
};


export const userResources = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { generateAccessToken } = req.user;
        const query = { _id: new ObjectId(generateAccessToken) };
        const options = { projection: { isValidPassword: 0 } };
        const user = await UserRepository.findOne(query, options);
        return res.json({ user });
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` });
    }
};


export const saveChanges = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email } = req.body;
        const { generateAccessToken } = req.user;
        const filter = { _id: new ObjectId(generateAccessToken) };
        const update = { $set: email };
        const user = await UserRepository.updateOne(filter, update, null);
        return res.json({ user });
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` });
    }
};

export const deleteToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res
            .status(StatusCode.SUCCESS)
            .json({ status: `${StatusCode.SUCCESS}` });
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` });
    }
};

