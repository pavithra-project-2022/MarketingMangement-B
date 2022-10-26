import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: Number,unique:true},
    empId: { type: Number },
    userFname: { type: String, required: true },
    userLname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
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
