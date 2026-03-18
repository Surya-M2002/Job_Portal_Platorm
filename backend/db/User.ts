import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "mongoose-type-email";

const schema = new mongoose.Schema(
  {
    email: {
      type: (mongoose.SchemaTypes as any).Email,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true,
    },
  },
  { collation: { locale: "en" } },
);

// Password hashing
schema.pre("save", function (next) {
  let user = this as any;

  // if the data is not modified
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// Password verification upon login
(schema.methods as any).login = function (password: string) {
  let user = this;

  return new Promise<void>((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

export default mongoose.model("UserAuth", schema);
