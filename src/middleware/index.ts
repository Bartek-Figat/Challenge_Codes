import { Request, Response, NextFunction, RequestHandler } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'
import { StatusCode } from '../utils/index'

export const isAuthenticated: RequestHandler = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token: string | undefined = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res
            .status(StatusCode.UNAUTHORIZED)
            .json({ status: `${StatusCode.UNAUTHORIZED}` });

    verify(token, `secret`, (err, decoded) => {
        if (err)
            return res.status(StatusCode.UNAUTHORIZED).json({
                status: `${StatusCode.UNAUTHORIZED}`,
            })

        if (req.originalUrl !== '/api/v1/logout') {
            req.user = decoded
            next()
        } else {
            req.user = null
            next()
        }
    });
};
