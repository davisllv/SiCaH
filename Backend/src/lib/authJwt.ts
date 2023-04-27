import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
      interface Request {
        user?: {};
      }
    }
  }

export function autenticarJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, 'S1C4H#2023#FTEC');
    req.user = decoded;
    next();
    return true
  } catch (err) {
    return res.status(401).json({ message: "Token inválido." });
  }
}


export function gerarToken(usuario: Object): string {
    const payload = { ...usuario };
    const options = { expiresIn: "1h" };
    const token = jwt.sign(payload, "S1C4H#2023#FTEC", options);
    return token;
}