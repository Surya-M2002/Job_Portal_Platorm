import { Request, Response, NextFunction } from "express";
import passport from "passport";

const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, function (err: any, user: any, info: any) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).json(info);
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default jwtAuth;
