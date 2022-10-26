import mongoose from "mongoose";
const EmployeeSchema = new mongoose.Schema(
  {
    empId: { type: String },
    empFname: { type: String, required: true },
    empMname: { type: String, required: false },
    empLname: { type: String, required: false },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    pan: { type: String, required: true },
    createBy: { type: String},
    createDate: { type: String },
    modifyBy: { type: String, required: false },
    modifyDate: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", EmployeeSchema);
