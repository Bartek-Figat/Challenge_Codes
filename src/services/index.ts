import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { ObjectId } from 'mongodb';
import { UserRepository } from '../repositories/index';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { StatusCode } from '../utils/index';
const saltRounds = 10;

export class UserService {
  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const emailValid = await new UserRepository().findOne({ email }, {});
      if (emailValid) res.status(StatusCode.BAD_REQUEST).json({ status: StatusCode.BAD_REQUEST });

      const isValidPassword = await hash(password, saltRounds);
      const user = {
        email,
        isValidPassword,
      };
      await new UserRepository().insertOne(user);
      res.status(StatusCode.SUCCESS).json({ status: StatusCode.SUCCESS });
    } catch (err) {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: StatusCode.INTERNAL_SERVER_ERROR });
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      console.log(email, password);
      const user = await new UserRepository().findOne({ email }, {});
      console.log(user);
      const match = user && (await compare(password, user.isValidPassword));

      if (!match) res.status(StatusCode.NOT_FOUND).json({ status: StatusCode.NOT_FOUND });
      const generateAccessToken = sign({ generateAccessToken: user._id }, `secret`);
      res.json({ generateAccessToken });
    } catch (err) {
      console.log(err);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: StatusCode.INTERNAL_SERVER_ERROR });
    }
  }

  public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { generateAccessToken } = req.user as {
        generateAccessToken: string;
      };
      const query = { _id: new ObjectId(generateAccessToken) };
      const options = { projection: { isValidPassword: 0 } };
      const user = await new UserRepository().findOne(query, options);
      res.format({
        'application/json': () => {
          res.send({ user });
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
  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      res.status(StatusCode.SUCCESS).format({
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
  public async removeToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(StatusCode.SUCCESS).json({ status: `${StatusCode.SUCCESS}` });
    } catch (err) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).format({
        'application/json': () => {
          res.send({ status: StatusCode.INTERNAL_SERVER_ERROR });
        },
      });
    }
  }
}
