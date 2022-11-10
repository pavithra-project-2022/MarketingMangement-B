import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: Number,unique:true},
    empId: { type: Number },
    userFname: { type: String, required: true },
    userLname: { type: String, required: false },
    username:{type:String,require:false},
    emailOrPhone: { type: String, required: true },
    email: {
      type: String,
      required: false,
      unique: false,
    },
    mobile: { type: String, required: false },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    verifyMethod:{type: String, required: false},
    isVerified:{type: Boolean,default:false},
    createDate:{type:String},
    modifyBy: { type: String, required: false },
    modifyDate: { type: String, required: false },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
