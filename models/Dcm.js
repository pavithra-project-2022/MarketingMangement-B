import mongoose from "mongoose";
const DcmSchema = new mongoose.Schema(
  {
    dcmId: { type: String },
    userId: { type: String },
    employeeName: { type: String },
    customerName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    inTime: { type: String, required: true },
    outTime: { type: String, required: true },
    needs: { type: String, required: true },
    expectedDate: { type: String, required: true },
    remarks: { type: String, required: true },
    status: { type: String },
    createDate: { type:String},
    createTime: { type:String},
    modifyBy: { type: String, required: false },
    modifyDate: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("Dcm", DcmSchema);