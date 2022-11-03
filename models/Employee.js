import mongoose from "mongoose";
const EmployeeSchema = new mongoose.Schema(
  {
    empId: { type: String },
    empFname: { type: String, required: false },
    empMname: { type: String, required: false },
    empLname: { type: String, required: false },
    email: { type: String, required: false },
    mobile: { type: String, required: false },
    pan: { type: String, required: false },
    createBy: { type: String},
    createDate: { type: String },
    modifyBy: { type: String, required: false },
    modifyDate: { type: String, required: false },

  },
  { timestamps: true }
);

export default mongoose.model("Employee", EmployeeSchema);
