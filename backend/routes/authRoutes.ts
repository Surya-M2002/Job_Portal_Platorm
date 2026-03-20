import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../lib/authKeys";
import User from "../db/User";
import JobApplicant from "../db/JobApplicant";
import Recruiter from "../db/Recruiter";

const router = express.Router();

router.post("/signup", (req, res) => {
  const data = req.body;
  let user = new User({
    email: data.email,
    password: data.password,
    type: data.type,
  });

  user
    .save()
    .then(() => {
      const userDetails =
        user.get("type") === "recruiter"
          ? new Recruiter({
              userId: user._id,
              name: data.name,
              contactNumber: data.contactNumber,
              bio: data.bio,
            })
          : new JobApplicant({
              userId: user._id,
              name: data.name,
              education: data.education,
              skills: data.skills,
              rating: data.rating,
              resume: data.resume,
              profile: data.profile,
            });

      userDetails
        .save()
        .then(() => {
          const token = jwt.sign({ _id: user._id }, jwtSecretKey);
          res.json({
            token: token,
            type: user.get("type"),
          });
        })
        .catch((err: any) => {
          user
            .deleteOne()
            .then(() => {
              if (err && err.code === 11000) {
                res.status(400).json({ message: "Email already exists" });
              } else if (err && err.message) {
                res.status(400).json({ message: err.message });
              } else {
                res.status(400).json({ message: "Signup failed" });
              }
            })
            .catch((deleteErr: any) => {
              res.status(400).json({ message: deleteErr?.message || "Signup failed" });
            });
        });
    })
    .catch((err: any) => {
      if (err && err.code === 11000) {
        res.status(400).json({ message: "Email already exists" });
      } else if (err && err.message) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({ message: "Signup failed" });
      }
    });
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err: any, user: any, info: any) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      // Token
      const token = jwt.sign({ _id: user._id }, jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

export default router;
