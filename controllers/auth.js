import User from "../models/User.js";
import Token from "../models/token.js";
import verifyOtp from "../models/OtpVerify.js";
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
    let user = await User.findOne({ emailOrPhone: req.body.emailemailOrPhone });

    if (user) {
      return res.status(409).send({ message: "Email already Exist!" });
    }
      user = await newUser.save();

      if(user.emailOrPhone.length <=10 ){
        await User.updateOne({ _id: user._id }, { mobile: user.emailOrPhone });
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const saltRounds = 10;
      const hashedOtp = await bcrypt.hash(otp, saltRounds);
      const newOtpVerify = await new verifyOtp({
        userId: user._id,
        otp: hashedOtp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      });

      await newOtpVerify.save();
      await res
      .status(200)
      .send({ message: "OTP sent your mobile number",userId:newOtpVerify.userId,otp: otp});
      }
      else{
        await User.updateOne({ _id: user._id }, { email: user.emailOrPhone });
        const token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
       
        const url = `https://marketing-mangement-system.netlify.app/users/${user.id}/verify/${token.token}`;
        await sendEmail(user.emailOrPhone, "Verify Email", url);
    
        await res
          .status(200)
          .send({ message: "An Email sent to your account please verify" });
      }
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
    await User.updateOne({ _id: user._id },{verifyMethod:"email"});
    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const  OtpVerification = async (req, res) => {
  try {
    let { userId, otp } = req.body;
    if (!userId && !otp) {
      return res.status(400).send({ message: "Empty otp details not allowed" });
      // throw Error("Empty otp details not allowed");
    } else {
      const verifyRecord = await verifyOtp.find({
        userId,
      });
      if (verifyRecord.length <= 0) {
        return res.status(400).send({ message: "Account does not exist." });
        // throw new Error("Account does not exist.");
      } else {
        const { expiresAt } = verifyRecord[0];
        const hashedOtp = verifyRecord[0].otp;

        if (expiresAt < Date.now()) {
          await verifyOtp.deleteMany({ userId });
          return res
            .status(400)
            .send({ message: "Code has expired.Please request again" });
          // throw new Error("Code has expired.Please request again");
        } else {
          const validOtp = await bcrypt.compare(otp, hashedOtp);

          if (!validOtp) {
            return res.status(400).send({ message: "Invalid code passed" });
            // throw new Error("Invalid code passed");
          } else {
            await User.updateOne({ _id: userId }, { isVerified: true });
            verifyOtp.deleteMany({ userId });
            await User.updateOne({ _id: userId },{verifyMethod:"mobile"});
            return res
              .status(200)
              .json({ message: "Mobile Number Verified Successfully" });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};



export const login = async (req, res, next) => {
  try {

    let user;
    let userLog = req.body.user
    if(userLog.includes("@")){
      user = await User.findOne({ email: req.body.user })
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
   else if(userLog.length === 10){
    user = await User.findOne({ mobile: req.body.user })
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect)
        return next(createError(400, "Wrong password or username!"));
        
      // if (!user.isVerified) {
      //   let token = await Token.findOne({ userId: user._id });
      //   if (!token) {
      //     token = await new Token({
      //       userId: user._id,
      //       token: crypto.randomBytes(32).toString("hex"),
      //     }).save();
      //     const url = `https://marketing-mangement-system.netlify.app/users/${user.id}/verify/${token.token}`;
      //     await sendEmail(user.email, "Verify Email", url);
      //   }

      //   return res
      //     .status(400)
      //     .send({ message: "An Email sent to your account please verify" });
      // }

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

    else{
      user = await User.findOne({ username: req.body.user })
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect)
        return next(createError(400, "Wrong password or username!"));

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
