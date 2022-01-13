import { Request, Response, NextFunction } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'
import { StatusCode } from '../utils/index'


export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token)
        return res
            .status(StatusCode.UNAUTHORIZED)
            .json({ status: `${StatusCode.UNAUTHORIZED}` })

    const decoded = verify(token, `secret`);
    req.user = decoded;
    next()
}


