import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const register = async (req, res, next) => {
  
  try {
    
    const userCollection = await User.count();
   
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
     userId : userCollection + 1,
     empId:userCollection + 1,
      ...req.body,
      password: hash,
      confirmPassword: hash
    });
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(409)
        .send({ message: "Email already Exist!" });
    } else {

   await newUser.save();


    res.status(200).send({ message: "User Registered Successfully",
    newUser});
    }
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email } ||{ mobile: req.body.mobile });
    // const number = await User.findOne({ mobile: req.body.mobile });
    if (!user) return next(createError(404, "User not found!"));
    // if (!number) return next(createError(404, "User not found!"));
    
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
  
      const { password,confirmPassword, ...otherDetails } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({message:"Logged in Successfully", details: { ...otherDetails } });
  
    
  
   
    } catch (err) {
    next(err);
  }
};