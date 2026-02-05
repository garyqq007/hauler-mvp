import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export function auth(requiredRoles?: string[]) {
  return (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    const h = req.headers.authorization;
    if (!h || !h.startsWith("Bearer "))
      return res.status(401).json({ error: "Unauthorized" });

    try {
      const token = h.split(" ")[1];
      const payload = jwt.verify(token, SECRET) as any;
      req.user = payload;

      if (
        requiredRoles &&
        !requiredRoles.includes(payload.role)
      )
        return res.status(403).json({ error: "Forbidden" });

      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };
}
