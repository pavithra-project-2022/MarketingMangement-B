import mongoose from "mongoose";
const Schema = mongoose.Schema;

const otpSchema = new Schema({
	userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,

});


export default mongoose.model("verifyOtp", otpSchema);