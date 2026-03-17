import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import env from "../config/env";

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    const authHeader = (req.headers?.authorization ?? "") as string;
    if (typeof authHeader === "string" && authHeader.length) {
        const match = authHeader.match(/^Bearer\s+(.+)$/i);
        if (match?.[1]) token = match[1].trim();
    }

    if(!token) return res.status(401).json({ error: "Not authorized, no token"});

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as {id: string}; 
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        res.status(401).json({ error: "Not authorized, invalid token"});
    }
};