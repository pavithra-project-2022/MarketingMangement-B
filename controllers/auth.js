import User from "../models/User.js";
import Token from "../models/token.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const register = async (req, res, next) => {
  try {
    const userCollection = await User.count();

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      userId: userCollection + 1,
      empId: userCollection + 1,
      ...req.body,
      password: hash,
      confirmPassword: hash,
    });
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(409).send({ message: "Email already Exist!" });
    }
    user = await newUser.save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    console.log(token);
    const url = `https://marketing-mangement-system.netlify.app/users/${user.id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    await res
      .status(200)
      .send({ message: "An Email sent to your account please verify" });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.updateOne({ _id: user._id }, { isVerified: true });
    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
// );

export const login = async (req, res, next) => {
  try {

    let user;

    if (
      (user = await User.findOne({ email: req.body.email })) ||
      (user = await User.findOne({ mobile: req.body.mobile })) ||
      (user = await User.findOne({ username: req.body.username }))
    ) {
     
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect)
        return next(createError(400, "Wrong password or username!"));
        
      if (!user.isVerified) {
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
          token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          }).save();
          const url = `https://marketing-mangement-system.netlify.app/users/${user.id}/verify/${token.token}`;
          await sendEmail(user.email, "Verify Email", url);
        }

        return res
          .status(400)
          .send({ message: "An Email sent to your account please verify" });
      }

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        "8hEnPGeoBqGUT6zksxt4G95gW+uMdzwe7EVaRnp0xRI="
      );
      const { password, confirmPassword, ...otherDetails } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          message: "Logged in Successfully",
          details: { ...otherDetails },
        });
    }
  } catch (err) {
    next(err);
  }
};
