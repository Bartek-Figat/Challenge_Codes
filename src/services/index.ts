import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { ObjectId } from 'mongodb';
import { UserRepository } from '../repositories/index';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { StatusCode } from '../utils/index';
const saltRounds = 10;

export class UserService {
  public async createUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const emailValid = await new UserRepository().findOne({ email }, {});
      if (emailValid)
        return res.status(StatusCode.BAD_REQUEST).json({ status: StatusCode.BAD_REQUEST });

      const isValidPassword = await hash(password, saltRounds);
      const user = {
        email,
        isValidPassword,
      };
      await new UserRepository().insertOne(user);
      return res.status(StatusCode.SUCCESS).json({ status: StatusCode.SUCCESS });
    } catch (err) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: StatusCode.INTERNAL_SERVER_ERROR });
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const user = await new UserRepository().findOne({ email }, {});
      const match = user && (await compare(password, user.isValidPassword));

      if (!match) return res.status(StatusCode.NOT_FOUND).json({ status: StatusCode.NOT_FOUND });
      const generateAccessToken = sign({ generateAccessToken: user._id }, `secret`);
      return res.json({ generateAccessToken });
    } catch (err) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: StatusCode.INTERNAL_SERVER_ERROR });
    }
  }

  public async getUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { generateAccessToken } = req.user as {
        generateAccessToken: string;
      };
      const query = { _id: new ObjectId(generateAccessToken) };
      const options = { projection: { isValidPassword: 0 } };
      const user = await new UserRepository().findOne(query, options);
      return res.format({
        'application/json': () => {
          res.send({ user });
        },
      });
    } catch (err) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).format({
        'application/json': () => {
          res.send({ status: StatusCode.INTERNAL_SERVER_ERROR });
        },
      });
    }
  }
  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { email } = req.body as { email: string };
      const { generateAccessToken } = req.user as {
        generateAccessToken: string;
      };
      const filter = { _id: new ObjectId(generateAccessToken) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          email,
        },
      };
      await new UserRepository().updateOne(filter, updateDoc, options);
      return res.status(StatusCode.SUCCESS).format({
        'application/json': () => {
          res.send({ status: StatusCode.SUCCESS });
        },
      });
    } catch (err) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).format({
        'application/json': () => {
          res.send({ status: StatusCode.INTERNAL_SERVER_ERROR });
        },
      });
    }
  }
  public async removeToken(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      return res.status(StatusCode.SUCCESS).json({ status: `${StatusCode.SUCCESS}` });
    } catch (err) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).format({
        'application/json': () => {
          res.send({ status: StatusCode.INTERNAL_SERVER_ERROR });
        },
      });
    }
  }
}
